const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VendorProfile',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Contact person name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Contact email is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Contact phone number is required'],
      trim: true,
    },
    eventType: {
      type: String,
      required: [true, 'Event type is required'],
      enum: [
        'Wedding',
        'Engagement',
        'Birthday',
        'Anniversary',
        'Baby shower',
        'Housewarming ceremony',
        'Family function',
        'Corporate event',
        'College fest',
        'Concert',
        'Other',
      ],
    },
    eventDate: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    eventLocation: {
      type: String,
      required: [true, 'Event location/city is required'],
      trim: true,
    },
    serviceType: {
      type: String,
      required: [true, 'Service required is mandatory'],
      trim: true,
    },
    expectedBudget: {
      type: Number,
      required: [true, 'Expected budget is required'],
      min: 0,
    },
    message: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected', 'Completed'],
      default: 'Pending',
      index: true,
    },
    vendorNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Enquiry', enquirySchema);

