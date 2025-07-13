import AuditItem from "../models/AuditItem.js";

const createAuditItem = async (auditItemBody) => {
    return AuditItem.create(auditItemBody);
}

const getAuditItemById = async (id) => {
    return AuditItem.findById(id).populate('productId');
}
const getAllAuditItems = async () => {
    return AuditItem.find().populate('productId');
};
const updateAuditItemById = async (auditItemId, auditItemBody) => {
    return AuditItem.findByIdAndUpdate(auditItemId, auditItemBody, { new: true }).populate('productId');
}
const deleteAuditItemById = async (auditItemId) => {
    return AuditItem.findByIdAndDelete(auditItemId);
}
const getAllAuditItemsByAuditId = async (auditId) => {
    return AuditItem.find({ auditId }).populate('productId');
}

export default {
    createAuditItem,
    getAuditItemById,
    getAllAuditItems,
    updateAuditItemById,
    deleteAuditItemById,
    getAllAuditItemsByAuditId
};  