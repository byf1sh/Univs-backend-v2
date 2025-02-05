const request = require('supertest');
const express = require('express');
const ReminderController = require('../controllers/reminder.controller');
const app = express();

// Set up middleware and routes
app.use(express.json()); // For parsing application/json
app.get('/reminders', ReminderController.index);
app.route('/reminders/:id')
  .get(ReminderController.show)
  .delete(ReminderController.destroy);
app.post('/reminders', ReminderController.store);

// Mock the controller methods
jest.mock('../controllers/reminder.controller', () => ({
  index: jest.fn((req, res) => {
    res.status(200).json({ message: 'Reminder list retrieved' });
  }),
  show: jest.fn((req, res) => {
    const id = req.params.id;
    res.status(200).json({ message: `Reminder with ID ${id} retrieved` });
  }),
  destroy: jest.fn((req, res) => {
    const id = req.params.id;
    res.status(200).json({ message: `Reminder with ID ${id} deleted` });
  }),
  store: jest.fn((req, res) => {
    res.status(201).json({ message: 'Reminder created' });
  }),
}));

describe('Reminder Routes', () => {
  it('should retrieve reminder list', async () => {
    const response = await request(app).get('/reminders');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Reminder list retrieved');
  });

  it('should show reminder details for multiple reminders', async () => {
    const reminderCount = 50;
    const responses = [];

    for (let i = 1; i <= reminderCount; i++) {
      const response = await request(app).get(`/reminders/${i}`);
      responses.push(response);
    }

    responses.forEach((response, index) => {
      expect(response.status).toBe(200);
      expect(response.body.message).toBe(`Reminder with ID ${index + 1} retrieved`);
    });
  });

  it('should create multiple reminders', async () => {
    const reminderCount = 50;
    const responses = [];

    for (let i = 1; i <= reminderCount; i++) {
      const response = await request(app).post('/reminders').send({
        title: `Reminder ${i}`,
        date: `2024-07-16T08:00:00Z`,
      });
      responses.push(response);
    }

    responses.forEach((response) => {
      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Reminder created');
    });
  });

  it('should delete multiple reminders', async () => {
    const reminderCount = 50;
    const responses = [];

    for (let i = 1; i <= reminderCount; i++) {
      const response = await request(app).delete(`/reminders/${i}`);
      responses.push(response);
    }

    responses.forEach((response, index) => {
      expect(response.status).toBe(200);
      expect(response.body.message).toBe(`Reminder with ID ${index + 1} deleted`);
    });
  });
});
