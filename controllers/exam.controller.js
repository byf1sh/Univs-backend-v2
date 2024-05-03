const { successResponse, errorResponse } = require("../utils/Response");
const {
  findAll,
  findById,
  filterByTitle,
  store,
} = require("../services/exam.service");
const { store: storeExamDetails } = require("../services/examDetails.service");
const { verifyToken } = require("../utils/processToken");
module.exports = {
  index: async (req, res) => {
    try {
      const { title } = req.query;
      let exams;
      if (title) {
        exams = await filterByTitle(title);
      } else {
        exams = await findAll();
      }
      return successResponse(
        res,
        200,
        exams,
        "Successfully retrieved all exams"
      );
    } catch (error) {
      return errorResponse(res, 400, error.message);
    }
  },
  show: async (req, res) => {
    try {
      const { id } = req.params;
      const exam = await findById(id);
      if (exam) {
        return successResponse(res, 200, exam, "Successfully retrieved exam");
      }
      return errorResponse(res, 404, "Exam not found");
    } catch (error) {
      return errorResponse(res, 400, error.message);
    }
  },
  store: async (req, res) => {
    try {
      const { authorization } = req.headers;
      const { title, imageUrl, category, examDetails } = req.body;
      req.user = verifyToken(authorization);
      req.body.userId = req.user.id;
      const exam = await store({
        title,
        imageUrl,
        category,
        userId: req.user.id,
      });
      examDetails.forEach(async (examDetail) => {
        await storeExamDetails({
          ...examDetail,
          examId: exam.id,
        });
      });
      return successResponse(res, 200, exam, "Successfully created exam");
    } catch (error) {
      return errorResponse(res, 400, error.message);
    }
  },
};
