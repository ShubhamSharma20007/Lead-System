const express = require('express');
const router = express.Router();
const LeadData = require("../models/LeadData");
const PipelineField = require("../models/PipelineField");
const { Op } = require('sequelize');

//  lead table get route 
router.get('/lead-table', (req, res) => {
    res.render('leadDataTableFormat')
})


router.post("/lead-table-data/:id", async (req, res) => {
    const { id } = req.params;
    const { email, usergroup, userId, startDate, endDate } = req.body;
    try {
        let where = {
            pipeline_Id: id,
            isDeleted: 0
        };

        if (startDate && endDate) {
            where.createdAt = {
                [Op.between]: [startDate, endDate]
            };
        }

        if (userId) {
            where.createdBy = userId;
        }

        if (usergroup !== 'admin') {
            where.loginEmail = email;
        }

        const allData = await LeadData.findAll({ where });

        return res.status(200).json({ data: allData, success: true });
    } catch (err) {
        return res.status(500).json({ success: false, err: err.message });
    }
});




router.get('/pipeline-table', (req, res) => {
    res.render('pipelineTable')
})

router.post("/pipeline-table-data", async (req, res) => {
    try {
        const allData = await PipelineField.findAll({
            where: {
                isDeleted: 0,
            },
        });
        console.log(allData)
        return res.status(200).json({ data: allData, success: true })
    } catch (err) {
        return res.status(500).json({ success: false, err: err.message })
    }

})



module.exports = router;
