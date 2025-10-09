export const verifyEmailOtp = async (req, res) => {
  try {
    const { email, otp, role, assessmentData } = req.body;

    // Validate OTP
    const otpRecord = await Otp.findOne({
      email,
      otp,
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    
    if (!user) {
      // Create new user with assessment data if provided
      const userData = {
        email,
        role,
        emailVerified: true
      };

      if (assessmentData) {
        userData.assessment = {
          ...assessmentData,
          submittedAt: new Date()
        };
        // Add basic profile info from assessment
        if (assessmentData.fullName) {
          userData.firstName = assessmentData.fullName.split(' ')[0] || '';
          userData.lastName = assessmentData.fullName.split(' ').slice(1).join(' ') || '';
        }
        if (assessmentData.phoneNumber) {
          userData.phone = assessmentData.phoneNumber;
        }
        if (assessmentData.city) {
          userData.city = assessmentData.city;
        }
      }

      user = await User.create(userData);
    } else {
      // Update existing user
      user.emailVerified = true;
      if (assessmentData) {
        user.assessment = {
          ...assessmentData,
          submittedAt: new Date()
        };
        // Update profile info if provided in assessment
        if (assessmentData.fullName) {
          user.firstName = assessmentData.fullName.split(' ')[0] || '';
          user.lastName = assessmentData.fullName.split(' ').slice(1).join(' ') || '';
        }
        if (assessmentData.phoneNumber) {
          user.phone = assessmentData.phoneNumber;
        }
        if (assessmentData.city) {
          user.city = assessmentData.city;
        }
      }
      await user.save();
    }

    // Delete OTP record
    await otp.deleteOne({ _id: otpRecord._id });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      token,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        assessment: user.assessment
      }
    });
  } catch (error) {
    console.error('Error in verifyEmailOtp:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying email',
      error: error.message
    });
  }
};