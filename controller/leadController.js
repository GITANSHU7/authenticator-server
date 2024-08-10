const Lead = require('../models/leadModels');


exports.createLead = async (req, res) => {
    try {
        const { name, email, number } = req.body;
        const newLead = new Lead({ name, email, number });
        // check if Lead already exists
        const leadExists = await Lead.findOne({ email });
        const leadNumberExists = await Lead.findOne({ number });
        if (leadExists) {
            return res.status(400).json({ message: 'Lead email already exists' });
        }

        if (leadNumberExists) {
            return res.status(400).json({ message: 'Number already exists' });
        }
        const savedLead = await newLead.save();
        res.status(201).json(savedLead);
    } catch (error) {
        // Handle validation or other errors
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}


// get all leads with pagination

exports.getLeads = async (req, res) => {

    try {

        const page = parseInt(req.query.page);
        const per_page_record = parseInt(req.query.per_page_record);

        let leads;
        let total;

        if (page && per_page_record) {
            const pageInt = parseInt(page);
            const perPageRecordInt = parseInt(per_page_record);
            const startIndex = (pageInt - 1) * perPageRecordInt;
            total = await Lead.countDocuments();
            leads = await Lead.find()
               
                .sort({ createdAt: -1 })
                .skip(startIndex)
                .limit(perPageRecordInt);
        } else {
            leads = await Lead.find().sort({ createdAt: -1 });
            total = leads.length;
        }

        return res.json({
            message: "Lead list retrieved successfully",
            data: leads,
            total: total,
            success: true,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }

}

// delete lead by id

exports.deleteLead = async (req, res) => {
    try {
        const leadId = req.params.id;
        const lead = await Lead.findByIdAndDelete(leadId);
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }
        res.status(200).json({ message: 'Lead deleted successfully' });
    }
    catch (err) {
        console.log(err);
    }
}

// update lead by id

exports.updateLead = async (req, res) => {
    try {
        const leadId = req.params.id;
        const { name, email, number } = req.body;

        // Find the lead in the database
        const lead = await Lead.findById(leadId);
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }

        // Update the lead information only if different from current values
        let isUpdated = false;
        if (name && name !== lead.name) {
            lead.name = name;
            isUpdated = true;
        }
        if (email && email !== lead.email) {
            lead.email = email;
            isUpdated = true;
        }
        if (number && number !== lead.number) {
            lead.number = number;
            isUpdated = true;
        }
       

        // Save the updated lead information only if there were changes
        if (isUpdated) {
            const savedLead = await lead.save();
            return res.json({
                message: "Lead updated successfully",
                success: true,
                data: savedLead,
            });
        } else {
            return res.json({
                message: "No changes detected",
                success: true,
            });
        }
    } catch (error) {
        // Handle other errors and return an error response
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}
// get lead by id

exports.getLeadById = async (req, res) => {
    try {
        const leadId = req.params.id;
        const lead = await Lead.findById(leadId);
        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }
        res.status(200).json({
            success: true,
            data: lead,
            message: 'Lead found successfully'
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });

    }
}