const { Router } = require('express');
const { checkAuth } = require('../../middleware/ensure-auth');
const Grade = require('../../models/assignments/Grade');
const Submission = require('../../models/assignments/Submission');
const { TEACHER, TA, STUDENT } = require('../../models/userRoles');

module.exports = Router()
  .post('/', checkAuth(TEACHER, TA), async(req, res, next) => {
    try {
      const { submission, grade, grader } = req.body;

      const newGrade = await Grade
        .create({ submission, grade, grader })
        .then(ass => res.send(ass));
      const updatedSubmission = await Submission
        .findByIdAndDelete(submission, { graded: true }, { new: true })
        .lean()
        .select({ title: true, active: true });

      res.send({ newGrade, updatedSubmission });

    } catch(err) {
      next(err);
    }
  })

  //get all grades grouped by assignment
  .get('/assignments', checkAuth(TEACHER, TA), (req, res, next) => {
    Grade
      .byAssignments()
      .then(grades => res.send(grades))
      .catch(next);
  })

  //get all grades grouped by assignment for a course
  .get('/assignments/:courseId', checkAuth(TEACHER, TA), (req, res, next) => {
    Grade
      .assignmentsByCourse(req.params.courseId)
      .then(grades => {
        const [result] = grades;
        res.send(result);
      })
      .catch(next);
  })

  .get('/student/:student', checkAuth(TA, TEACHER, STUDENT), (req, res, next) => {
    const { student } = req.params;
    if(req.pushPinUser.role === STUDENT && req.pushPinUser._id !== student) return next('Not Authorized');
    //check that student = logged in user, OR logged in user is an admin
    req.user.sub
    Grade
      .studentTotalGrade(student)
      .then(totalGrade => res.send(totalGrade))
      .catch(next);
  })

  //get the grade for a submission 
  .get('/:submissionId', (req, res, next) => {
    const { submissionId } = req.params;
    Grade
      .findOne({ submission: submissionId })
      .lean()
      .then(grade => res.send(grade))
      .catch(next);
  })

  .patch('/:gradeId', checkAuth(TEACHER, TA), async(req, res, next) => {
    Grade
      .findByIdAndUpdate(req.params.gradeId, req.body, { new: true })
      .lean()
      .then(updatedGrade => res.send(updatedGrade))
      .catch(next);
  });


