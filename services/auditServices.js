import Audit from "../models/Audit.js";

const createAudit = async (auditBody) => {
    return Audit.create(auditBody);
}
const getAuditById = async (id) => {
    return Audit.findById(id).populate('roomId');
}
const getAllAudits = async () => {
    return Audit.find().populate('items').populate('roomId').populate('guestId');
};
const updateAuditById = async (auditId, auditBody) => {
    return Audit.findByIdAndUpdate(auditId, auditBody, { new: true }).populate('roomId');
}
const deleteAuditById = async (auditId) => {
    return Audit.findByIdAndDelete(auditId);
}
const getAllAuditsByRoomId = async (roomId) => {
    return Audit.find({ roomId }).populate('roomId');
}   

const getAllAuditsByType = async (auditType) => {
    if (!auditType) {
        throw new Error("Status is required to filter rooms");
    }
    return Audit.find({ auditType:auditType }).populate('roomId').populate('guestId');;
}

export default {
    createAudit,
    getAuditById,
    getAllAudits,
    updateAuditById,
    deleteAuditById,
    getAllAuditsByRoomId,
    getAllAuditsByType
};  