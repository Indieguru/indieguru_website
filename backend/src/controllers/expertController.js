
import Session from "../models/Session.js";
import Expert from "../models/Expert.js";

export const addSlot = async (req, res) => {
  try {
    const { date, startTime, endTime, paymentFee } = req.body;
    const expertId = req.body.user._id; // Logged-in expert's ID

    console.log(date, startTime, endTime, paymentFee, expertId);

    // Basic validations
    if (!date || !startTime || !endTime || !paymentFee) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if already a slot at same time for this expert
    const existingSlot = await Session.findOne({
      expert: expertId,
      date: new Date(date),
      startTime,
      endTime,
    });

    if (existingSlot) {
      return res.status(400).json({ message: "Slot already exists for this time" });
    }

    const newSlot = new Session({
      expert: expertId,
      date: new Date(date),
      startTime,
      endTime,
      paymentFee,
      status: 'not booked',
      meetLink: 'N/A', // Will update meet link after booking
    });

    await newSlot.save();

    res.status(201).json({ message: "Slot created successfully", slot: newSlot });

  } catch (error) {
    console.error('Error creating slot:', error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const matchExperts = async (req, res) => {
  try {
    const { userType, guidanceType, industry } = req.query;

    // Build the query based on user requirements
    let query = {};

    // Match experts based on target audience
    query.targetAudience = userType;

    // Match expertise based on guidance type
    switch (guidanceType) {
      case 'To know about my stream selection':
      case 'Explore more options about my stream':
        query.expertise = 'stream_selection';
        break;
      case 'Career counseling for next steps':
      case 'General Career counseling for next steps':
        query.expertise = 'career_counseling';
        break;
      case 'To know about competitive exams':
      case 'How and where to prepare for competitive exams':
        query.expertise = 'competitive_exams';
        break;
      case 'Assistance with applying for study abroad opportunities':
        query.expertise = 'study_abroad';
        break;
      case 'To know about a particular profession':
        query.expertise = 'industry_specific';
        if (industry) query.industries = industry;
        break;
      case 'Resume building, interview preparation, and job search support':
        query.expertise = 'resume_interview';
        break;
      case 'Entrepreneurship guidance or business mentoring':
        query.expertise = 'entrepreneurship';
        break;
      case 'Learn about doctorate procedures in INDIA':
      case 'Learn about Masters in INDIA':
        query.expertise = 'higher_education';
        break;
      case 'One-on-one expert mentorship to advance my career path':
        query.expertise = 'career_counseling';
        if (industry) query.industries = industry;
        break;
      case 'How to pivot to a different career/Industry':
        query.expertise = 'career_transition';
        if (industry) query.industries = industry;
        break;
    }

    // Find matching experts
    const experts = await Expert.find(query)
      .select('-password -emailOtp -gid')
      .sort({ ratings: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      experts
    });
  } catch (error) {
    console.error('Error matching experts:', error);
    res.status(500).json({
      success: false,
      message: 'Error matching experts',
      error: error.message
    });
  }
};