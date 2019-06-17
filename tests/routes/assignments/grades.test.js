require('dotenv').config();
const request = require('supertest');
const app = require('../../../lib/app');
const mongoose = require('mongoose');
const connect = require('../../../lib/utils/connect');
const { seedAsses } = require('../../utils/seed-data');
const Assignment = require('../../../lib/models/assignments/Assignment');
const Course = require('../../../lib/models/Course');

