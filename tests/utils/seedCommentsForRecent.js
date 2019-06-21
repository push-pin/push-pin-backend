require('dotenv').config();
const mongoose = require('mongoose');
const chance = require('chance').Chance();
const User = require('../../lib/models/profiles/User');
const Submission = require('../../lib/models/assignments/Submission');
const Comment = require('../../lib/models/assignments/Comment');
const { TEACHER, STUDENT } = require('../../lib/models/userRoles');

async function seedStudentComments(student, subs, count = 25) {
  const comments = [...Array(count)].map(() => {
    const submission = chance.pickone(subs);
    return {
      submission,
      comment: chance.sentence(),
      commenter: student._id
    };
  });
  return Comment.create(comments);
}

async function seedTeacherComments(teacher, subs, count = 25) {
  const comments = [...Array(count)].map(() => {
    const submission = chance.pickone(subs);
    return {
      submission,
      comment: chance.sentence(),
      commenter: teacher._id
    };
  });
  return Comment.create(comments);
}

async function seed() {
  const student = await User.create({
    auth0id: '12345abc',
    role: STUDENT,
    firstName: 'Ryan',
    lastName: 'Gosling',
    email: chance.email()
  });

  const submission1 = await Submission.create({
    assignment: new mongoose.Types.ObjectId(),
    student: student._id,
    submission: chance.sentence()
  });

  const submission2 = await Submission.create({
    assignment: new mongoose.Types.ObjectId(),
    student: student._id,
    submission: chance.sentence()
  });

  const submission3 = await Submission.create({
    assignment: new mongoose.Types.ObjectId(),
    student: student._id,
    submission: chance.sentence()
  });

  const subs = [submission1, submission2, submission3];
  const teacher = await User.create({
    auth0id: 'hot_teacher',
    role: TEACHER,
    firstName: 'Jemima',
    lastName: 'Kirke',
    email: chance.email()
  });

  await Promise.all([
    seedStudentComments(student, subs),
    seedTeacherComments(teacher, subs)
  ]);
}

module.exports = {
  seedStudentComments,
  seedTeacherComments,
  seed
};
