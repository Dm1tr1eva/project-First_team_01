export const getSavedArticles = async (req, res) => {
  const user = await req.user.populate("savedArticles");

  res.status(200).json({
    savedArticles: user.savedArticles,
  });
};
