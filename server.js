const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const UserRouter = require('./routers/user.routes')
const TestRouter = require('./routers/test.routes')
const WritingRouter = require('./routers/writingtest.routes')
const UserWritingAnswerRouter = require('./routers/UserWritingAnswer.routes')
const ScoreRouter = require('./routers/score.routes')
// const modelInt = require('./models/db_sync');
// modelInt()

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());


// Use Auth Routes
app.use('/api', UserRouter);
app.use('/api/test', TestRouter);
app.use('/api/task', WritingRouter);
app.use('/api/test', UserWritingAnswerRouter);
app.use('/api/score', ScoreRouter)
console.log("arunkumars")

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
