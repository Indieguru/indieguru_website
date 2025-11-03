import Expert from '../models/Expert.js';
import User from '../models/User.js';

export const submitAssessment = async (req, res) => {
  try {
    const { assessmentQuestions, personalInfo, rawFormData } = req.body;
    
    // Validate user authentication
    console.log(req.body);
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'User must be authenticated to submit assessment'
      });
    }
        // Check for duplicate phone number if it's being updated
        if (personalInfo.phoneNumber) {
          const existingUserWithPhone = await User.findOne({ 
            phone: personalInfo.phoneNumber,
            _id: { $ne: req.user.id }
          });
    
          if (existingUserWithPhone) {
            return res.status(409).json({
              success: false,
              message: 'This phone number is already associated with another account',
              code: 11000
            });
          }
        }

    // Map frontend role values to schema enum values
    const roleMapping = {
      'I am doing my graduation': 'undergraduate',
      'I am working currently': 'working',
      'I am pursuing masters': 'postgraduate',
      'I am in Class 9th or 10th': 'highschool',
      'I am in Class 11th or 12th': 'secondary'
    };

    // Map career journey answers to exact frontend dropdown values
    const careerJourneyMapping = {
      "I’m on a path - just need to validate if it’s the right one": 'validate',
      "I kinda know the field - but need more clarity and direction": 'clarity',
      "I’m still exploring - open to discovering what fits me best": 'explore',
      "Honestly, I feel stuck - not sure how to move forward": 'guidance'
    };

    // Map learning style answers to exact frontend dropdown values
    const learningStyleMapping = {
      "I thrive with regular 1:1 sessions and personal guidance": 'oneOnOne',
      "I’m good with a nudge - I prefer exploring on my own post-session": 'selfPaced',
      "I need a structured path - give me a clear curriculum and plan": 'structured',
      "I love learning with others - group discussions and shared ideas work best": 'group',
      "Something else works better for me (Please specify)": 'other'
    };

    // Create assessment data with full context
    const assessmentData = {
      questions: assessmentQuestions,
      role: roleMapping[assessmentQuestions.role.answer] || null,
      stream: assessmentQuestions.stream?.answer || null,
      degree: assessmentQuestions.degree?.answer || null,
      learningStyle: learningStyleMapping[assessmentQuestions.learningStyle.answer] || assessmentQuestions.learningStyle.answer,
      otherLearningStyle: assessmentQuestions.learningStyle.otherStyle,
      confusion: parseInt(assessmentQuestions.confusion.answer),
      careerJourney: careerJourneyMapping[assessmentQuestions.careerJourney.answer] || assessmentQuestions.careerJourney.answer,
      expertiseNeeded: assessmentQuestions.expertise.answer,
      submittedAt: new Date()
    };

    // Create career flow data (synced with assessment)
    const careerFlowData = {
      currentRole: roleMapping[assessmentQuestions.role.answer] || null,
      stream: assessmentQuestions.stream?.answer || null,
      degree: assessmentQuestions.degree?.answer || null,
      linkedinUrl: personalInfo.linkedinUrl || null,
      careerJourney: careerJourneyMapping[assessmentQuestions.careerJourney.answer] || assessmentQuestions.careerJourney.answer,
      learningStyle: learningStyleMapping[assessmentQuestions.learningStyle.answer] || assessmentQuestions.learningStyle.answer,
      otherLearningStyle: assessmentQuestions.learningStyle.otherStyle,
      lastUpdated: new Date()
    };

    // Update user profile with assessment data, personal info, and career flow
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          assessment: assessmentData,
          careerFlow: careerFlowData,
          firstName: personalInfo.fullName?.split(' ')[0] || '',
          lastName: personalInfo.fullName?.split(' ').slice(1).join(' ') || '',
          phone: personalInfo.phoneNumber,
          email: personalInfo.email,
          city: personalInfo.city,
          linkedinUrl: personalInfo.linkedinUrl
        }
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prepare query for finding matching experts
   
const query = {
  status: "approved",
  $or: [
    { targetAudience: assessmentQuestions.role.answer }, // Match exact target audience
   // Match any of the target audiences
    { expertise: assessmentQuestions.expertise.answer }, // Match exact expertise
     // or { expertise: { $in: [ex] } }
  ]
};
    console.log('Expert matching query:', JSON.stringify(query, null, 2));

    // Find matching experts with smart sorting
    const matchedExperts = await Expert.find(query)
      .select('firstName lastName email title expertise industries rating totalFeedbacks profilePicture sessionPricing targetAudience')
      .sort({ 
        // Prioritize exact expertise matches
        'expertise': assessmentQuestions.expertise.answer ? -1 : 1,
        // Then by rating and feedback count
        rating: -1,
        totalFeedbacks: -1
      })
      .limit(10);

    res.status(200).json({
      success: true,
      assessment: updatedUser.assessment,
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