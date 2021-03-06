import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import userReducer, * as userActions from '../../store/user';

import './UserProfile.css';

export default function UserProfile() {
	const { username } = useParams();
	const dispatch = useDispatch();
	// const sessionUser = useSelector((state) => state.sessionUser.user);
	const currentUser = useSelector((state) => state.user);
	const [user, setUser] = useState(null);
	const [imageUrl, setImageUrl] = useState(
		'https://mymusicdb.s3.us-east-2.amazonaws.com/profile-pictures/default.png'
	);

	useEffect(() => {
		dispatch(userActions.fetchUser(username));
	}, [dispatch, username]);

	useEffect(() => {
		if (currentUser) setUser(currentUser);
	}, [currentUser]);

	const profileImg = currentUser?.currUser?.profileImageUrl
		? currentUser.currUser.profileImageUrl
		: 'https://mymusicdb.s3.us-east-2.amazonaws.com/profile-pictures/default.png';

	return (
		<div className="main-user-profile">
			{currentUser?.currUser && (
				<>
					<div className="user-header">
						<img
							className="profile-picture"
							src={profileImg}
							alt={`${currentUser.currUser.username}'s profile`}
						/>
						<div className="user-info-names">
							<h2 className="display-name">
								{currentUser.currUser.displayName}
							</h2>
							<h3 className="username">{currentUser.currUser.username}</h3>
						</div>
					</div>
					<div className="songs-albums-container">
						<div className="user-songs">
							<h2 class="songs-header">{`${currentUser.currUser.username}'s songs`}</h2>
							{currentUser.currUser.Songs.map((song) => (
								<>
									<div className="mini-song">
										<Link className="song-link" to={`/songs/${song.id}`}>
											<img
												className="mini-song-pic"
												src={song.imageUrl ? song.imageUrl : imageUrl}
												alt={song.title}
											/>
											<div className="mini-song-info">
												<h4 className="song-user-title">
													{currentUser.currUser.displayName}
												</h4>
												<h3 className="song-title">{song.title}</h3>
											</div>
										</Link>
									</div>
									<audio
										id="audio"
										preload="auto"
										className="mini-audio-player"
										controls
									>
										<source src={song.songUrl} />
									</audio>
								</>
							))}
						</div>
						<div className="user-albums">
							<h2 className="songs-header">{`${currentUser.currUser.username}'s albums`}</h2>
							{currentUser.currUser.Albums.map((album) => (
								<Link to={`/albums/${album.id}`}>
									<img
										className="mini-album-pic"
										src={album.imageUrl}
										alt={album.title}
									/>
									<h3>{album.title}</h3>
								</Link>
							))}
						</div>
					</div>
				</>
			)}
		</div>
	);
}
