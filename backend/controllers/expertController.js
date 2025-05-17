const expertLogout = async (req, res) => {
  try {
    // Clear the JWT token cookie
    res.clearCookie('expertToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Internal server error during logout' });
  }
};

module.exports = {
  expertLogout
};