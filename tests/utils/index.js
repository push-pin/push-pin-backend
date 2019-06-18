require('dotenv').config();
const mongoose = require('mongoose');
const connect = require('../../lib/utils/connect');
const { TEACHER, TA, STUDENT } = require('../../lib/models/userRoles');
const { 
  seedStudents,
  seedTAs,
  seedTeachers,
  seedUsers,
  seedCourses,
  seedAsses,
  seedSubmissions,
  seedGrades,
  seedComments,
  seedResources,
  seedAnnouncements
} = require('../utils/seed-data');


async function seed() {
  connect();
  await mongoose.connection.dropDatabase();
  await Promise.all([
    seedStudents(),
    seedTAs(),
    seedTeachers(),
    seedUsers(10, TEACHER, TA, STUDENT),
    seedCourses(),
    seedAsses(),
    seedSubmissions(),
    seedGrades(),
    seedComments(),
    seedResources(),
    seedAnnouncements()
  ]);
  await mongoose.connection.close();

}

seed();
