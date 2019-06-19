const chance = require('chance').Chance();
const User = require('../../lib/models/profiles/User');
const Student = require('../../lib/models/profiles/Student');
const Teacher = require('../../lib/models/profiles/Teacher');
const TeacherAssistant = require('../../lib/models/profiles/TeacherAssistant');
const Course = require('../../lib/models/Course');
const Resource = require('../../lib/models/Resource');
const Assignment = require('../../lib/models/assignments/Assignment');
const Submission = require('../../lib/models/assignments/Submission');
const Grade = require('../../lib/models/assignments/Grade');
const Comment = require('../../lib/models/assignments/Comment');
const Announcement = require('../../lib/models/Announcement');
const { TEACHER, TA, STUDENT } = require('../../lib/models/userRoles');

function seedUsers(userCount = 10, ...type) {
  const users = [...Array(userCount)].map(() => ({
    auth0id: chance.word(),
    role: chance.pickone(type),
    firstName: chance.name(),
    lastName: chance.animal(),
    email: chance.email()
  }));
  return User.create(users);
}

async function seedCourses(courseCount = 4) {
  const courseTypes = ['BootCamp1', 'BootCamp2', 'CareerTrack'];
  const courses = [...Array(courseCount)].map(() => ({
    name: `JavaScript ${chance.profession()}`,
    term: `Spring ${chance.year()}`,
    startDate: chance.date(),
    endDate: chance.date(),
    courseType: chance.pickone(courseTypes)
  }));
  return await Course.create(courses);
}

async function seedStudents(studentCount = 10) {
  const users = await seedUsers(studentCount, STUDENT);
  const courses = await seedCourses(); 
  const TAs = await seedUsers(4, TA);
  const students = [...Array(studentCount)].map((_, i) => ({
    user: users[i]._id,
    currentCourse: chance.pickone(courses),
    pastCourses: [chance.pickone(courses), chance.pickone(courses)],
    grader: chance.pickone(TAs)
  }));
  return Student.create(students);
}

async function seedTeachers(teacherCount = 10) {
  const users = await seedUsers(teacherCount, TEACHER);
  const courses = await seedCourses(); 
  const teachers = [...Array(teacherCount)].map((_, i) => ({
    user: users[i]._id,
    courses: [chance.pickone(courses), chance.pickone(courses)]
  }));
  return Teacher.create(teachers);
}

async function seedTAs(taCount = 10) {
  const users = await seedUsers(taCount, TA);
  const courses = await seedCourses(); 
  const tas = [...Array(taCount)].map((_, i) => ({
    user: users[i]._id,
    currentCourse: chance.pickone(courses),
    pastCourses: [chance.pickone(courses), chance.pickone(courses)]
  }));
  return TeacherAssistant.create(tas);
}

async function seedAsses(assCount = 20) {
  const courses = await seedCourses(1);
  const types = ['reading', 'solo', 'mob'];
  const asses = [...Array(assCount)].map(() => ({
    course: chance.pickone(courses),
    type: chance.pickone(types),
    title: chance.word(),
    instructions: chance.sentence(),
    classDate: chance.date(),
    dateAvailable: chance.date(),
    dateDue: chance.date(),
    dateClosed: chance.date(),
    pointsPossible: chance.integer({ min : 5, max: 50 })
  }));
  return Assignment.create(asses);
}

async function seedSubmissions(count = 100) {
  const asses = await seedAsses(1);
  const users = await seedUsers(1, STUDENT);
  const subs = [...Array(count)].map(() => ({
    assignment: chance.pickone(asses),
    student: chance.pickone(users),
    submission: chance.sentence()
  }));
  return Submission.create(subs);
}

async function seedGrades(count = 100) {
  const graders = await seedUsers(5, TA);
  const subs = await seedSubmissions(count);
  const grades = [...Array(count)].map((_, i) => ({
    submission: subs[i],
    grade: chance.integer({ min: 0, max: 110 }),
    grader: chance.pickone(graders)
  }));
  return Grade.create(grades);
}

async function seedAssesForAgg(assCount = 20) {
  const courses = await seedCourses(2);
  const types = ['reading', 'solo', 'mob'];
  const asses = [...Array(assCount)].map(() => ({
    course: chance.pickone(courses),
    type: chance.pickone(types),
    title: chance.word(),
    instructions: chance.sentence(),
    classDate: chance.date(),
    dateAvailable: chance.date(),
    dateDue: chance.date(),
    dateClosed: chance.date(),
    pointsPossible: chance.integer({ min : 5, max: 50 })
  }));
  return Assignment.create(asses);
}

async function seedSubmissionsForAgg(count = 50) {
  const asses = await seedAssesForAgg(4);
  const users = await seedUsers(1, STUDENT);
  const subs = [...Array(count)].map(() => ({
    assignment: chance.pickone(asses),
    student: chance.pickone(users),
    submission: chance.sentence()
  }));
  return Submission.create(subs);
}

async function seedGradesForAgg(count = 50) {
  const graders = await seedUsers(5, TA);
  const subs = await seedSubmissionsForAgg(count);
  const grades = [...Array(count)].map((_, i) => ({
    submission: subs[i],
    grade: chance.integer({ min: 0, max: 110 }),
    grader: chance.pickone(graders)
  }));
  return Grade.create(grades);
}

async function seedComments(count = 25) {
  const users = await seedUsers(5, TA);
  const subs = await seedSubmissions(5);
  const comments = [...Array(count)].map(() => {
    const submission = chance.pickone(subs);
    return {
      submission,
      comment: chance.sentence(),
      commenter: chance.pickone([...users, submission.student])
    };
  });
  return Comment.create(comments);
}

async function seedResources(count = 10) {
  const users = await seedUsers(5, STUDENT);
  const courses = await seedCourses();
  const resources = [...Array(count)].map(() => ({
    course: chance.pickone(courses),
    user: chance.pickone(users),
    type: chance.pickone(['video', 'link', 'image']),
    description: chance.sentence(),
    info: { hi: 'there' }
  }));
  return Resource.create(resources);
}

async function seedAnnouncements(count = 25) {
  const users = await seedUsers(5, TEACHER); 
  const courses = await seedCourses(1);
  const announcements = [...Array(count)].map(() => ({
    course: chance.pickone(courses),
    user: chance.pickone(users),
    title: `Alchemy got a new pet ${chance.animal()}`,
    body: chance.sentence()
  }));
  return Announcement.create(announcements);
}

module.exports = {
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
  seedAnnouncements,
  seedGradesForAgg
};
