from flask import Flask, request, render_template
import pickle
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import numpy as np
import re

# Load your machine learning model
model = pickle.load(open('models/best_rf_model.pkl', 'rb'))

# Spotify API credentials

app = Flask(__name__,template_folder='template')

# Spotify API setup

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    song_link = request.get_json()['songLink']
    track_id = extract_track_id(song_link)
    track_features = get_track_features(track_id)

    genre_mapping = {
    0: 'rnb',
    1: 'hiphop',
    2: 'rock',
    3: 'edm',
    4: 'country'}

    x = np.array([
        [track_features['acousticness'], track_features['danceability'], track_features['energy'],
        track_features['instrumentalness'], track_features['key'], track_features['liveness'],
        track_features['loudness'], track_features['mode'], track_features['speechiness'],
        track_features['tempo'], track_features['time_signature'], track_features['valence']]
    ])

    predicted_genre = model.predict(x)

    return {'prediction':  genre_mapping[predicted_genre[0]]}

def extract_track_id(song_link):
    pattern = r'https?://open\.spotify\.com/track/([a-zA-Z0-9]+)'
    match = re.search(pattern, song_link)
   
    if match:
        track_id = match.group(1)
        return track_id
    else:
        return None
# https://embed.spotify.com/oembed?url=https%3A%2F%2Fopen.spotify.com%2Ftrack%2F4KULAymBBJcPRpk1yO4dOG
def get_track_features(track_id):
    track_info = sp.track(track_id)
    features = sp.audio_features(tracks=[track_id])[0]
    return {
        'track_id': track_id,
        'track_name': track_info['name'],
        'artist_name': track_info['artists'][0]['name'],
        'album_name': track_info['album']['name'],
        'duration_ms': track_info['duration_ms'],
        'acousticness': features['acousticness'],
        'danceability': features['danceability'],
        'energy': features['energy'],
        'instrumentalness': features['instrumentalness'],
        'key': features['key'],
        'liveness': features['liveness'],
        'loudness': features['loudness'],
        'mode': features['mode'],
        'speechiness': features['speechiness'],
        'tempo': features['tempo'],
        'time_signature': features['time_signature'],
        'valence': features['valence']
    }


if __name__ == '__main__':
    app.run(debug=True)