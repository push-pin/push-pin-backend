const chance = require('chance').Chance();
const User = require('../../lib/models/profiles/User');
const Student = require('../../lib/models/profiles/Student');
const Teacher = require('../../lib/models/profiles/Teacher');
const TeacherAssistant = require('../../lib/models/profiles/TeacherAssistant');
const Course = require('../../lib/models/Course');
const { TEACHER, TA, STUDENT } = require('../../lib/models/userRoles');

jest.mock('../../lib/middleware/ensure-auth.js');

function seedUsers(userCount = 10, type) {
  const users = [...Array(userCount)].map(() => ({
    auth0id: chance.word(),
    role: type,
    firstName: chance.name(),
    lastName: chance.animal(),
    email: chance.email()
  }));
  return User.create(users);
}

async function seedCourses(courseCount = 4) {
  const courses = [...Array(courseCount)].map(() => ({
    name: `JavaScript ${chance.profession()}`,
    term: `Spring ${chance.year()}`,
    startDate: chance.date(),
    endDate: chance.date(),
    courseType: 'CareerTrack'
  }));
  return await Course.create(courses);
}

async function seedStudents(studentCount = 10) {
  const users = await seedUsers(studentCount, STUDENT);
  const courses = seedCourses(); 
  const students = [...Array(studentCount)].map((_, i) => ({
    userId: users[i]._id,
    currentCourse: chance.pickone(courses),
    pastCourses: [chance.pickone(courses), chance.pickone(courses)]
  }));
  return Student.create(students);
}

async function seedTeachers(teacherCount = 10) {
  const users = await seedUsers(teacherCount, TEACHER);
  const courses = seedCourses(); 
  const teachers = [...Array(teacherCount)].map((_, i) => ({
    userId: users[i]._id,
    courses: [chance.pickone(courses), chance.pickone(courses)]
  }));
  return Teacher.create(teachers);
}

async function seedTAs(taCount = 10) {
  const users = await seedUsers(taCount, TA);
  const courses = seedCourses(); 
  const tas = [...Array(taCount)].map((_, i) => ({
    userId: users[i]._id,
    currentCourse: chance.pickone(courses),
    pastCourses: [chance.pickone(courses), chance.pickone(courses)]
  }));
  return TeacherAssistant.create(tas);
}

module.exports = {
  seedStudents,
  seedTAs,
  seedTeachers,
  seedUsers,
  seedCourses
};
