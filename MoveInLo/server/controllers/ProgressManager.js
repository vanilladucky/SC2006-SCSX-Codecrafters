const Account = require("../models/AccountModel");
const { SERVICE_STATUS } = require("../enum/ServiceStatus");

const getProgress = async (req, res) => {
  try {
    console.log("Attempting to retrieve job progress...");
    const { id } = req.params;

    const progressList = await Account.find(
      { job: { $elemMatch: { _id: id } } },
      { progress: "$job.progress" }
    );

    if (progressList.length < 1) {
      return res.status(400).json({
        success: false,
        body: "Failed to retrieve progress info.",
      });
    }

    const progressInfo = progressList[0];
    console.log("Successfully obtained job progress.");
    return res.status(200).json({ success: true, body: progressInfo });
  } catch (error) {
    return res.status(500).json({ success: false, body: error.message });
  }
};

const updateCollection = async (req, res) => {
  try {
    console.log("Attempting to update job to 'In Progress'");

    const { jobId } = req.body;
    const updatedInProgress = await Account.updateOne(
      { "job._id": jobId },
      { $set: { "job.$.progress": SERVICE_STATUS.PROGRESS } },
      { returnDocument: "after" }
    );

    console.log(updatedInProgress);

    if (!updatedInProgress || !updatedInProgress.modifiedCount) {
      return res.status(400).json({
        success: false,
        body: "Failed to update job to 'In Progress'",
      });
    }

    console.log("Successfully updated to `In Progress`");
    return res.status(200).json({ success: true, body: updatedInProgress });
  } catch (error) {
    return res.status(500).json({ success: false, body: error.message });
  }
};

const updateDelivered = async (req, res) => {
  try {
    console.log("Attempting to update job to 'Delivered'");

    const { jobId } = req.body;
    const updatedDelivered = await Account.updateOne(
      { "job._id": jobId },
      { $set: { "job.$.progress": SERVICE_STATUS.DELIVERED } },
      { returnDocument: "after" }
    );

    console.log(updatedDelivered);

    if (!updatedDelivered || !updatedDelivered.modifiedCount) {
      return res.status(400).json({
        success: false,
        body: "Failed to update job to 'Delivered'",
      });
    }

    console.log("Successfully updated to `Delivered`");
    return res.status(200).json({ success: true, body: updatedDelivered });
  } catch (error) {
    return res.status(500).json({ success: false, body: error.message });
  }
};

const updatePaid = async (req, res) => {
  try {
    console.log("Attempting to update job to 'Paid'");

    const { jobId } = req.body;
    const updatedPaid = await Account.updateOne(
      { "job._id": jobId },
      { $set: { "job.$.progress": SERVICE_STATUS.PAID } },
      { returnDocument: "after" }
    );

    console.log(updatedPaid);

    if (!updatedPaid || !updatedPaid.modifiedCount) {
      return res.status(400).json({
        success: false,
        body: "Failed to update job to 'Paid'",
      });
    }

    console.log("Successfully updated to `Paid`");
    return res.status(200).json({ success: true, body: updatedPaid });
  } catch (error) {
    return res.status(500).json({ success: false, body: error.message });
  }
};

module.exports = {
  getProgress,
  updateCollection,
  updateDelivered,
  updatePaid,
};
