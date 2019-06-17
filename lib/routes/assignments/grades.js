const { Router } = require('express');
const { checkAuth } = require('../../middleware/ensure-auth');
const Grade = require('../../models/assignments/Grade');
const Submission = require('../../models/assignments/Submission');
const { TEACHER, TA } = require('../../models/userRoles');

module.exports = Router()
  .post('/', checkAuth(TEACHER, TA), async(req, res, next) => {
    try {
      const { submission, Grade, Gradeer } = req.body;

      const newGrade = await Grade
        .create({ submission, Grade, Gradeer })
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
  .get('/:submissionId', (req, res, next) => {
    const { submissionId } = req.params.submissionId;
    Grade
      .find({ submission: submissionId, active: true })
      .lean()
      .then(allAsses => res.send(allAsses))
      .catch(next);
  })

  .patch('/:id', checkAuth(TEACHER, TA), async(req, res, next) => {
    Grade
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .lean()
      .then(updatedAss => res.send(updatedAss))
      .catch(next);
  });

