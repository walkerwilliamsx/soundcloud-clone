const express = require('express');
const { check } = require('express-validator');
const asyncHandler = require('express-async-handler');

const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Song, Comment, Album } = require('../../db/models');
const {
	singleMulterUpload,
	singlePublicFileUpload,
	multipleMulterUpload,
	multiplePublicFileUpload,
} = require('../../awsS3');

const router = express.Router();

const validateSignup = [
	check('email')
		.exists({ checkFalsy: true })
		.isEmail()
		.withMessage('Please provide a valid email.'),
	check('username')
		.exists({ checkFalsy: true })
		.isLength({ min: 4 })
		.withMessage('Please provide a username with at least 4 characters.'),
	check('username').not().isEmail().withMessage('Username cannot be an email.'),
	check('password')
		.exists({ checkFalsy: true })
		.isLength({ min: 6 })
		.withMessage('Password must be 6 characters or more.'),
	handleValidationErrors,
];

router.post(
	'/',
	// singleMulterUpload('image'),
	validateSignup,
	asyncHandler(async (req, res) => {
		const { email, password, username, displayName } = req.body;
		const user = await User.signup({
			username,
			email,
			password,
			displayName,
			// profileImageUrl,
		});

		setTokenCookie(res, user);

		return res.json(user);
	})
);

router.get(
	'/:username',
	asyncHandler(async (req, res) => {
		const { username } = req.params;

		const user = await User.findOne({
			where: { username },
			include: { model: Comment },
		});
		const albums = await Album.findAll({ where: { userId: user.id } });
		const songs = await Song.findAll({ where: { userId: user.id } });

		user.dataValues.Songs = songs;
		user.dataValues.Albums = albums;

		return res.json(user);
	})
);

module.exports = router;
