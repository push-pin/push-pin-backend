const { Router } = require('express');
const { checkAuth } = require('../../middleware/ensure-auth');
const Assignment = require('../../models/assignments/Assignment');
const Submission = require('../../models/assignments/Submission');
const { TEACHER, TA } = require('../../models/userRoles');

module.exports = Router()
  .post('/', checkAuth(TEACHER, TA), (req, res, next) => {
    const { course, type, title, instructions, dateAvailable, dateDue, dateClosed } = req.body;
    Assignment
      .create({ course, type, title, instructions, dateAvailable, dateDue, dateClosed })
      .then(ass => res.send(ass))
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    Assignment
      .findById(req.params.id)
      .lean()
      .then(assignment => res.send(assignment))
      .catch(next);
  })
  .get('/course/:course', (req, res, next) => {
    const course = req.params.course;
    Assignment
      .find({ course, active: true })
      .lean()
      .then(ass => res.send(ass))
      .catch(next);
  })
  .get('/course/inactive/:course', (req, res, next) => {
    const course = req.params.course;

    Assignment
      .find({ course, active: false })
      .lean()
      .then(allAsses => res.send(allAsses))
      .catch(next);
  })
  .get('/weekataglance/course/:course/student/:student', (req, res, next) => {
    const { course, student } = req.params;
    
    const monday = getMonday();
    const dateRange = 7; // range in days from start date
    const endDate = getEndDate(dateRange);

    Assignment.weekAtAGlance(monday, endDate, course)
      .then(thisWeeksAsses => {
        const assIds = thisWeeksAsses.map(ass => ass._id);
        const matchingSubs = Submission.find({ student, assignment: assIds });
        const weeksAsses = assesByDay(thisWeeksAsses);
        return Promise.all([
          weeksAsses, 
          matchingSubs
        ]);
      })
      .then(([weeksAsses, matchingSubs]) => {
        res.send({ weeksAsses, matchingSubs });
      })
      .catch(next);
  })
  .patch('/:id', checkAuth(TEACHER, TA), (req, res, next) => {
    Assignment
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .lean()
      .then(updatedAss => res.send(updatedAss))
      .catch(next);
  })
  .delete('/:id', checkAuth(TEACHER, TA), (req, res, next) => { 
    Assignment
      .findByIdAndUpdate(req.params.id, { active: false }, { new: true })
      .lean()
      .then(inactiveAss => res.send(inactiveAss))
      .catch(next);
  });


const getMonday = () => {
  const today = new Date();
  const diff = today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1);
  const monday =  new Date(today.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
};

const getEndDate = dateRange => {
  const today = new Date();
  return new Date(today.setDate(today.getDate() + dateRange));
};

const assesByDay = thisWeeksAsses => {
  let week = { mon: [], tues: [], wed: [], thurs: [], fri: [] };
  thisWeeksAsses.forEach(ass => {
    switch(ass.dateDue.getDay()) {
      case 0:
        week.mon = [...week.mon, ass];
        return week;
      case 1:
        week.tues = [...week.tues, ass];
        return week;
      case 2:
        week.wed = [...week.wed, ass];
        return week;
      case 3:
        week.thurs = [...week.thurs, ass];
        return week;
      case 4:
        week.fri = [...week.fri, ass];
        return week;
    }
  });
  return week;
};

