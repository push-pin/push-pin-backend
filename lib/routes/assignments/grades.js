const { Router } = require('express');
const { checkAuth } = require('../../middleware/ensure-auth');
const Grade = require('../../models/assignments/Grade');
const Submission = require('../../models/assignments/Submission');
const { TEACHER, TA, STUDENT } = require('../../models/userRoles');

module.exports = Router()
  .post('/', checkAuth(TEACHER, TA), async(req, res, next) => {
    try {
      const { submission, grade, grader } = req.body;
      await Grade
        .create({ submission, grade, grader })
        .then(ass => res.send(ass));
      await Submission
        .findByIdAndUpdate(submission, { graded: true }, { new: true })
        .lean()
        .select({ title: true, active: true });

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

  .get('/recent/:courseId', checkAuth(TEACHER, TA), (req, res, next) => {
    Grade
      .recentGrades(req.params.courseId)
      .then(recentGrades => res.send(recentGrades))
      .catch(next);
  })

  //get all of a student's grades, grader name, assignment name and points possible
  .get('/student/recent/:studentId', checkAuth(TEACHER, TA, STUDENT), (req, res, next) => {
    Grade
      .studentGrades(req.params.studentId)
      .then(allGrades => res.send(allGrades))
      .catch(next);
  })

  .get('/student/:student', checkAuth(TA, TEACHER, STUDENT), (req, res, next) => {
    const { student } = req.params;
    if(req.pushPinUser.role === STUDENT && req.pushPinUser._id !== student) return next('Not Authorized');
    Grade
      .studentTotalGrade(student)
      .then(totalGrade => res.send(totalGrade))
      .catch(next);
  })

  //get the grade for a submission 
  .get('/:submissionId', checkAuth(TA, TEACHER, STUDENT), (req, res, next) => {
    const { submissionId } = req.params;
    Grade
      .findOne({ submission: submissionId })
      .lean()
      .then(res => {
        if(req.pushPinUser.role === STUDENT && req.pushPinUser._id !== res.student) {
          return next('Not Authorized');
        }
        return res;
      })
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


