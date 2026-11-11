
const express = require('express');
const router = express.Router();

const Student = require('../models/Student.cjs');
const requireAuth = require('../middleware/auth.cjs');

// GET STUDENT STATISTICS (AGGREGATION)
router.get('/stats', requireAuth, async (req, res) => {
    try {
        const stats = await Student.aggregate([
            {
                $match: {
                    isActive: { $in: [true, false] }
                }
            },
            {
                $group: {
                    _id: null,
                    totalStudents: { $sum: 1 },
                    activeStudents: {
                        $sum: {
                            $cond: ['$isActive', 1, 0]
                        }
                    },
                    inactiveStudents: {
                        $sum: {
                            $cond: ['$isActive', 0, 1]
                        }
                    },
                    averageAge: { $avg: '$age' }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalStudents: 1,
                    activeStudents: 1,
                    inactiveStudents: 1,
                    averageAge: {
                        $round: ['$averageAge', 2]
                    }
                }
            }
        ]);

        res.status(200).json(
            stats[0] || {
                totalStudents: 0,
                activeStudents: 0,
                inactiveStudents: 0,
                averageAge: null
            }
        );

    } catch (err) {
        console.error('Statistics error:', err);

        res.status(500).json({
            error: 'Failed to retrieve statistics.'
        });
    }
});


// GET ALL STUDENTS WITH POPULATE
router.get('/', requireAuth, async (req, res) => {
    try {
        const students = await Student.find()
            .populate('createdBy', 'name email')
            .sort({ name: 1 });

        res.status(200).json(students);

    } catch (err) {
        console.error('Get students error:', err);

        res.status(500).json({
            error: 'Failed to retrieve students.'
        });
    }
});


// ADD STUDENT
router.post('/', requireAuth, async (req, res) => {
    try {
        const { name, email, age, isActive } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                error: 'Name and email are required.'
            });
        }

        const existingStudent = await Student.findOne({ email });

        if (existingStudent) {
            return res.status(409).json({
                error: 'Student email already exists.'
            });
        }

        const newStudent = await Student.create({
            name,
            email,
            age,
            isActive: isActive ?? true,
            createdBy: req.user.userId
        });

        const populatedStudent = await Student.findById(newStudent._id)
            .populate('createdBy', 'name email');

        res.status(201).json({
            message: 'Student added successfully.',
            student: populatedStudent
        });

    } catch (err) {
        console.error('Add student error:', err);

        res.status(400).json({
            error: err.message
        });
    }
});


// UPDATE STUDENT
router.put('/:id', requireAuth, async (req, res) => {
    try {
        const { name, email, age, isActive } = req.body;

        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            { name, email, age, isActive },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedStudent) {
            return res.status(404).json({
                error: 'Student not found.'
            });
        }

        res.status(200).json({
            message: 'Student updated successfully.',
            student: updatedStudent
        });

    } catch (err) {
        console.error('Update student error:', err);

        res.status(400).json({
            error: err.message
        });
    }
});


// DELETE STUDENT
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const deletedStudent = await Student.findByIdAndDelete(
            req.params.id
        );

        if (!deletedStudent) {
            return res.status(404).json({
                error: 'Student not found.'
            });
        }

        res.status(200).json({
            message: 'Student deleted successfully.',
            student: deletedStudent
        });

    } catch (err) {
        console.error('Delete student error:', err);

        res.status(500).json({
            error: 'Failed to delete student.'
        });
    }
});

module.exports = router;
