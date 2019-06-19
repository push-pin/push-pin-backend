const { Router } = require('express');
const Resource = require('../models/Resource');
const { checkAuth } = require('../middleware/ensure-auth');
const { TEACHER, TA } = require('../models/userRoles');

module.exports = Router()
  .post('/', (req, res, next) => {
    const { course, user, type, description, info } = req.body;
    Resource
      .create({ course, user, type, description, info })
      .then(newResource => res.send(newResource))
      .catch(next);
  })
  .get('/', (req, res, next) => {
    Resource
      .find({ active: true })
      .lean()
      .then(allActiveResources => res.send(allActiveResources))
      .catch(next);
  })
  .get('/inactive', (req, res, next) => {
    Resource
      .find({ active: false })
      .lean()
      .then(allInactiveResources => res.send(allInactiveResources))
      .catch(next);
  })
  .get('/:resourceId', (req, res, next) => {
    Resource
      .findById(req.params.resourceId)
      .lean()
      .then(resource => res.send(resource))
      .catch(next);
  })
  .get('/course/:course', (req, res, next) => {
    const { course } = req.params;

    Resource
      .find({ course, active: true })
      .lean()
      .then(allResourcesInCourse => res.send(allResourcesInCourse))
      .catch(next);
  })
  .patch('/:id', (req, res, next) => {
    Resource
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .lean()
      .then(updatedResource => res.send(updatedResource))
      .catch(next);
  })
  .delete('/:id', checkAuth(TA, TEACHER), (req, res, next) => { 
    Resource
      .findByIdAndUpdate(req.params.id, { active: false }, { new: true })
      .lean()
      .then(inactiveResource => res.send(inactiveResource))
      .catch(next);
  });

