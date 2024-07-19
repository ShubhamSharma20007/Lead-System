var express = require('express');
var router = express.Router();
const PipelineModel = require("../models/PipelineField")
const PipelineCustomeFieldsModel = require("../models/pipelineCustomField")
const UserModel = require('../models/userModel')
const PipelineUserPermission = require('../models/pipelineUserPermission')
const { Op, where } = require('sequelize')



//* pipeline model
//? POST

router.post('/pipeline-model',async(req,res)=>{

    try {
      const {pipeline_field} = req.body;
      const existingPip = await PipelineModel.findOne({
        where:{
         field_name :pipeline_field
        }
      })
      if(existingPip){
        return res.status(400).json({success:false,message:"pipeline model already exists"})
      }
      const pipeline = await PipelineModel.create({
        field_name :pipeline_field,
        createdById:req.session.userId

      })
      return res.json({success:true,message:"pipeline model created successfully",pipeline})
    } catch (error) {
      console.log(error)
      return res.status(500).json({success:false,message:error.message})
    }
})



//* pipeline model
//? GET

router.get('/pipeline-data',async(req,res)=>{

  const pipelineData = await PipelineModel.findAll();
  return res.status(200).json({success:true,pipelineData})

})

// router.get('/pipeline-permission-data/:userId', async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const PipelinePermissionData = await PipelineUserPermission.findAll({
//       where: {
//         user_id: userId
//       }
//     });


//     const pipelineIds = PipelinePermissionData.map(permission => permission.pipeline_id);

//     const pipelineData = await PipelineModel.findAll({
//       where: {
//         id: pipelineIds
//       }
//     });

//     return res.status(200).json({ success: true, pipelineData });
//   } catch (err) {
//     return res.status(400).json({ success: false, message: err.message });
//   }
// });

router.get('/pipeline-permission-data/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch user details to check role (assuming you have a User model)
    const user = await UserModel.findOne({
      where: {
        id: userId,
      
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    let pipelineData;

    if (user.user_group === 'admin') {
      // If user is admin, fetch all pipelines
      pipelineData = await PipelineModel.findAll({
        where:{
          isDeleted:0
        }
      });
    } else {
      // If user is not admin, fetch pipelines based on permissions
      const pipelinePermissionData = await PipelineUserPermission.findAll({
        where: {
          user_id: userId
        }
      });

      const pipelineIds = pipelinePermissionData.map(permission => permission.pipeline_id);

      pipelineData = await PipelineModel.findAll({
        where: {
          id: pipelineIds,
          isDeleted:0
        }
      });
    }

    return res.status(200).json({ success: true, pipelineData });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
});




//* pipeline Custom Model

router.post("/pipeline-custom-fields", async (req, res) => {
  try {
    const pipelineField = await PipelineCustomeFieldsModel.create({
      field_name: req.body.value,
      pipeline_select_id: req.body.select_data_Id,
    });
    return res.status(200).json({ success: true, message: "Pipeline custom field created successfully", data: pipelineField });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});






// * pipeline select fetch data

router.get('/pipeline-select-data/:id',async(req,res)=>{
  try{
    const {id} = req.params;
    const pipelineSelectData = await PipelineCustomeFieldsModel.findAll({
      where:{
        pipeline_select_id : id
      }
    })   
    return res.status(200).json({success:true,pipelineSelectData})

  }catch(err){
    return res.status(400).json({success:false,message:err.message})
  }
})



//! pipline user permission

router.post("/pipeline-user-permission", async (req, res) => {
  try {
      const { searchValue } = req.body;

      const pipelineUserPermission = await UserModel.findAll({
          where: {
              [Op.and]: [
                  {
                      [Op.or]: [
                          { username: { [Op.like]: `%${searchValue}%` } },
                          { email: { [Op.like]: `%${searchValue}%` } }
                      ]
                  },
                  { user_group: { [Op.ne]: 'admin' } } // Exclude users with 'admin' role
              ]
          }
      });

      return res.status(200).json({ success: true, pipelineUserPermission });
  } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
  }
});



//* pipeline user permission

router.post("/pipeline-user-permission-save", async (req, res) => {
  try {
    const { pipeline_ids, user_id } = req.body;

    // Delete existing permissions for the user
    await PipelineUserPermission.destroy({
      where: { user_id: user_id }
    });

    // Create new permissions
    const newPermissions = pipeline_ids.map(pipeline_id => ({
      pipeline_id,
      user_id
    }));

    await PipelineUserPermission.bulkCreate(newPermissions);

    return res.status(200).json({
      success: true,
      message: "Pipeline user permissions created successfully"
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
});




//* get pipeline user permission

router.get("/get-pipeline-user-permission/:user_id", async (req, res) => {
  const alluser = await PipelineUserPermission.findAll({
    where:{
      user_id : req.params.user_id
    }
  });
  return res.status(200).json({success:true,alluser})

})

// user permission update and select pipeline functionality
router.post('/pipeline-remove/:id',async function (req,res){
  const {id} = req.params
  try {
    const pipelineModelField = await PipelineModel.findOne({
      where:{
        id,

      }
    });
    
    if (pipelineModelField) {
      await pipelineModelField.update({isDeleted : 1});
      return res.status(200).json({ success: true, message: "Pipeline deleted successfully" });
    }

    return res.status(200).json({ message: 'Pipeline and associated user model successfully marked as deleted' });
  } catch (error) {
    console.error(error); 
    return res.status(500).json({ message: 'An error occurred while removing the pipeline' });
  }
});

//  update pipeline name on click edit button
router.put('/update-pipeline-fieldname/:id',async function(req,res){
  const {id} = req.params
  const {field_name} = req.body
  try {
    const pipelineModelField = await PipelineModel.update({field_name},{where:{id}});
    if (pipelineModelField) {
      return res.status(200).json({ success: true, message: "Pipeline name updated successfully" });
    }
    return res.status(200).json({ message: 'No pipeline found with this id' });
  } catch (error) {
    console.error(error); 
    return res.status(500).json({ message: 'An error occurred while updating the pipeline name' });
  }
})



//  lead report all user gets base on pipeline

router.post("/get-pipeline-users/:pipeline_id", async (req, res) => {
  const userRole = req.session.user_group;
  const userId = req.session.userId;

  // Ensure pipeline_id is provided
  const { pipeline_id } = req.params;
  if (!pipeline_id) {
    return res.status(400).json({ success: false, message: 'Pipeline ID is required' });
  }

  try {
    if (userRole === "admin") {
      // Admin user logic
      const pipelineUserPermission = await PipelineUserPermission.findAll({
        where: { pipeline_id }
      });

      if (pipelineUserPermission && pipelineUserPermission.length > 0) {
        const pipelineUsers = pipelineUserPermission.map(user => user.user_id);
        const pipelineUsersData = await UserModel.findAll({
          where: { id: pipelineUsers }
        });

        return res.status(200).json(pipelineUsersData);
      } else {
        return res.status(200).json({ success: false, message: 'No users found for this pipeline' });
      }
    } else {
      // Non-admin user logic
      const pipelineUserPermission = await PipelineUserPermission.findOne({
        where: {
          pipeline_id,
          user_id: userId
        }
      });

      if (pipelineUserPermission) {
        // User has permission to access this pipeline
        const pipelineUsersData = await UserModel.findAll({
          where: { id: userId }
        });

        return res.status(200).json(pipelineUsersData);
      } else {
        // User does not have permission to access this pipeline
        return res.status(403).json({ success: false, message: 'You do not have permission to access this pipeline' });
      }
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});





module.exports = router