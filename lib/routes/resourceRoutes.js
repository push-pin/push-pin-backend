const { Router } = require('express');
const Resource = require('../../lib/models/Resource');

module.exports = Router()
  .post('/', (req, res, next) => {
    const { course, type, description, info } = req.body;
    Resource
      .create({ course, type, description, info })
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
  .get('/:ResourceId', (req, res, next) => {
    Resource
      .findById(req.params.ResourceId)
      .lean()
      .then(allInactiveResources => res.send(allInactiveResources))
      .catch(next);
  })
  .patch('/:id', (req, res, next) => {
    Resource
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .lean()
      .then(updatedResource => res.send(updatedResource))
      .catch(next);
  })
  .delete('/:id', (req, res, next) => { 
    Resource
      .findByIdAndUpdate(req.params.id, { active: false }, { new: true })
      .lean()
      .then(inactiveResource => res.send(inactiveResource))
      .catch(next);
  });
