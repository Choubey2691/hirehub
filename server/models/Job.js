const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Job title is required'], trim: true },
    description: { type: String, required: [true, 'Job description is required'] },
    responsibilities: [{ type: String }],
    requirements: [{ type: String }],
    benefits: [{ type: String }],
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    location: { type: String, required: [true, 'Location is required'] },
    jobType: { 
      type: String, 
      enum: ['Full Time', 'Part Time', 'Internship', 'Contract'], 
      required: true 
    },
    workMode: { 
      type: String, 
      enum: ['Remote', 'Hybrid', 'On-site'], 
      required: true 
    },
    salaryMin: { type: Number, default: 0 },
    salaryMax: { type: Number, default: 0 },
    experience: { type: String, default: 'Fresher' },
    skills: [{ type: String }],
    vacancies: { type: Number, default: 1 },
    deadline: { type: Date },
    status: { type: String, enum: ['Active', 'Closed'], default: 'Active' }
  },
  { timestamps: true }
);

// Text index for optimized search
jobSchema.index({ title: 'text', description: 'text', skills: 'text', location: 'text' });

module.exports = mongoose.model('Job', jobSchema);
