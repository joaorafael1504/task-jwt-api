const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const app = express();

app.use(bodyParser.json());

mongoose.connect('mongodb+srv://jrafael1504:H47miVoyixr9IiIf@api.rizeigl.mongodb.net/?retryWrites=true&w=majority&appName=API')
    .then(() => {
        console.log('Conectado ao MongoDB Atlas');
    })
    .catch(err => {
        console.error('Erro ao conectar ao MongoDB Atlas', err);
    });

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    role: String,
    password: String
});

const TaskSchema = new mongoose.Schema({
    title: String,
    description: String,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
});

const User = mongoose.model('User', UserSchema);
const Task = mongoose.model('Task', TaskSchema);

const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.sendStatus(401);
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.sendStatus(401);
    }
    jwt.verify(token, 'your_secret_key', (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
};

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email, password })
        .then(user => {
            if (user) {
                const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, 'your_secret_key', { expiresIn: '1h' });
                res.status(200).json({ message: 'Login efetuado com sucesso', token });
            } else {
                res.status(401).send('Email ou senha incorretos');
            }
        })
        .catch(err => res.status(500).send(err));
});

app.post('/register', (req, res) => {
    const newUser = new User(req.body);
    newUser.save()
        .then(user => res.status(201).send(user))
        .catch(err => res.status(400).send(err));
});

app.get('/users', authenticate, (req, res) => {
    User.find()
        .then(users => res.send(users))
        .catch(err => res.status(500).send(err));
});

app.get('/users/:id', authenticate, (req, res) => {
    User.findById(req.params.id)
        .then(user => res.send(user))
        .catch(err => res.status(500).send(err));
});

app.put('/users/:id', authenticate, (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(user => res.send(user))
        .catch(err => res.status(500).send(err));
});

app.delete('/users/:id', authenticate, (req, res) => {
    User.findByIdAndDelete(req.params.id)
        .then(() => res.sendStatus(204))
        .catch(err => res.status(500).send(err));
});

app.get('/tasks', authenticate, (req, res) => {
    Task.find({ owner: req.user.id })
        .then(tasks => res.send(tasks))
        .catch(err => res.status(500).send(err));
});

app.post('/tasks', authenticate, (req, res) => {
    const newTask = new Task({ ...req.body, owner: req.user.id });
    newTask.save()
        .then(task => res.status(201).send(task))
        .catch(err => res.status(400).send(err));
});

app.put('/tasks/:id', authenticate, (req, res) => {
    Task.findOneAndUpdate({ _id: req.params.id, owner: req.user.id }, req.body, { new: true })
        .then(task => res.send(task))
        .catch(err => res.status(500).send(err));
});

app.delete('/tasks/:id', authenticate, (req, res) => {
    Task.findOneAndDelete({ _id: req.params.id, owner: req.user.id })
        .then(() => res.sendStatus(204))
        .catch(err => res.status(500).send(err));
});

app.get('/tasks/no-owner', authenticate, (req, res) => {
    Task.find({ owner: null })
        .then(tasks => res.send(tasks))
        .catch(err => res.status(500).send(err));
});

app.put('/tasks/:id/assign', authenticate, (req, res) => {
    Task.findOneAndUpdate({ _id: req.params.id }, { owner: req.body.ownerId }, { new: true })
        .then(task => res.send(task))
        .catch(err => res.status(500).send(err));
});

app.get('/users/roles/count', authenticate, (req, res) => {
    User.aggregate([
        { $group: { _id: "$role", count: { $sum: 1 } } }
    ])
    .then(counts => res.send(counts))
    .catch(err => res.status(500).send(err));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
