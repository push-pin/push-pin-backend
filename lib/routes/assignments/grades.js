const { Router } = require('express');
const { checkAuth } = require('../../middleware/ensure-auth');
const Grade = require('../../models/assignments/Grade');
const Submission = require('../../models/assignments/Submission');
const { TEACHER, TA } = require('../../models/userRoles');

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
  //get the for a submission 
  .get('/:submissionId', (req, res, next) => {
    const { submissionId } = req.params;
    Grade
      .find({ submission: submissionId })
      .lean()
      .then(grades => res.send(grades[0]))
      .catch(next);
  })

  .patch('/:gradeId', checkAuth(TEACHER, TA), async(req, res, next) => {
    Grade
      .findByIdAndUpdate(req.params.gradeId, req.body, { new: true })
      .lean()
      .then(updatedGrade => res.send(updatedGrade))
      .catch(next);
  });

