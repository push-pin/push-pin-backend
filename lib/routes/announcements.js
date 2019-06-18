const { Router } = require('express');
const Announcement = require('../models/Announcement');
const { checkAuth } = require('../middleware/ensure-auth');
const { TEACHER, TA } = require('../models/userRoles');

module.exports = Router()
  .post('/', checkAuth(TA, TEACHER), (req, res, next) => {
    const { user, course, title, body } = req.body;
    Announcement
      .create({ user, course, title, body })
      .then(ann => res.send(ann))
      .catch(next);
  })

  .get('/:courseId', (req, res, next) => {
    Announcement
      .find({ active: true, course: req.params.courseId })
      .lean()
      .limit(20)
      .populate('user', {
        firstName: true,
        lastName: true
      })
      .then(announcements => res.send(announcements))
      .catch(next);
  })

  .delete('/:id', checkAuth(TEACHER, TA), (req, res, next) => {
    Announcement
      .findByIdAndUpdate(req.params.id, { active: false }, { new: true })
      .lean()
      .then(inactiveAnnouncement => res.send(inactiveAnnouncement))
      .catch(next);
  });
