import Expert from '../models/Expert.js';
import User from '../models/User.js';

export const submitAssessment = async (req, res) => {
  try {
    const { 
      role, 
      stream, 
      degree, 
      learningStyle, 
      confusion, 
      careerJourney, 
      guidanceFor,
      linkedinUrl,
      fullName,
      phoneNumber,
      email,
      city,
      industry
    } = req.body;

    // Update user profile with assessment data
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          assessment: {
            role,
            stream,
            degree,
            learningStyle,
            confusion,
            careerJourney,
            guidanceFor,
            linkedinUrl,
            fullName,
            phoneNumber,
            email,
            city,
            submittedAt: new Date()
          }
        }
      },
      { new: true }
    );

    // Build query for expert matching
    const query = {
      targetAudience: { $in: [role] }
    };

    // Add industry filter if provided
    if (industry) {
      query.industries = { $in: [industry] };
    }

    // Map learning styles to expertise areas
    const learningStyleToExpertise = {
      'I prefer personalized one-on-one guidance for stream and career exploration': ['stream_selection', 'career_counseling'],
      'I learn better through structured study materials and self-paced learning': ['career_counseling'],
      'I need a systematic roadmap with clear milestones for my preparation': ['competitive_exams', 'career_counseling'],
      'I enjoy learning through group study sessions and peer discussions': ['career_counseling'],
      'I prefer industry-specific training and practical workshops': ['industry_specific', 'career_counseling']
    };

    // Add expertise requirements based on guidance type and learning style
    const expertiseRequirements = [];

    switch (guidanceFor) {
      case 'To know about my stream selection':
      case 'Explore more options about my stream':
        expertiseRequirements.push('stream_selection');
        break;
      case 'Career counseling for next steps':
      case 'General Career counseling for next steps':
        expertiseRequirements.push('career_counseling');
        break;
      case 'To know about competitive exams':
      case 'How and where to prepare for competitive exams':
        expertiseRequirements.push('competitive_exams');
        break;
      case 'Assistance with applying for study abroad opportunities':
        expertiseRequirements.push('study_abroad');
        break;
      case 'Resume building, interview preparation, and job search support':
        expertiseRequirements.push('resume_interview');
        break;
      case 'Entrepreneurship guidance or business mentoring':
        expertiseRequirements.push('entrepreneurship');
        break;
      case 'Learn about doctorate procedures in INDIA':
      case 'Learn about Masters in INDIA':
        expertiseRequirements.push('higher_education');
        break;
      case 'How to pivot to a different career/Industry':
        expertiseRequirements.push('career_transition');
        break;
      case 'To know about a particular profession':
        expertiseRequirements.push('industry_specific');
        break;
    }

    // Add expertise based on learning style
    if (learningStyle && learningStyleToExpertise[learningStyle]) {
      expertiseRequirements.push(...learningStyleToExpertise[learningStyle]);
    }

    // Remove duplicates and add to query
    query.expertise = { $in: [...new Set(expertiseRequirements)] };

    // Find matching experts
    const matchedExperts = await Expert.find(query)
      .select('-password -emailOtp -gid')
      .sort({ ratings: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      user: updatedUser,
      experts: matchedExperts
    });
  } catch (error) {
    console.error('Error in submitAssessment:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing assessment',
      error: error.message
    });
  }
};

export const getAssessmentStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('assessment');

    res.status(200).json({
      success: true,
      hasCompletedAssessment: !!user.assessment?.submittedAt,
      assessment: user.assessment
    });
  } catch (error) {
    console.error('Error in getAssessmentStatus:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching assessment status',
      error: error.message
    });
  }
};