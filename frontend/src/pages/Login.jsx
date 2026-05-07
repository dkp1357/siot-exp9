import React, { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import api from '../api';
import { loadModels, getFaceDescriptor } from '../faceService';
import { Camera, LogIn, AlertCircle, Loader } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [image, setImage] = useState(null);
  const [descriptor, setDescriptor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modelsReady, setModelsReady] = useState(false);
  const [error, setError] = useState('');
  const webcamRef = useRef(null);

  useEffect(() => {
    loadModels()
      .then(() => setModelsReady(true))
      .catch(() => setError('Failed to load face detection models'));
  }, []);

  const capture = useCallback(async () => {
    if (!webcamRef.current) return;
    setError('');

    try {
      const video = webcamRef.current.video;
      const desc = await getFaceDescriptor(video);
      const imageSrc = webcamRef.current.getScreenshot();
      setImage(imageSrc);
      setDescriptor(desc);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!descriptor) {
      setError('Face verification is required for login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/login', {
        username,
        face_descriptor: descriptor,
      });
      onLogin(response.data.access_token);
    } catch (err) {
      setError(err.response?.data?.detail || 'Authentication failed. Check your username and face.');
      setImage(null);
      setDescriptor(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card animate-fade-in">
      <h2>Welcome Back</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Authenticate with your username and face.
      </p>

      {error && <div className="alert alert-error"><AlertCircle size={18} /> {error}</div>}

      {!modelsReady && (
        <div className="alert" style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--primary)', border: '1px solid rgba(99,102,241,0.2)' }}>
          <Loader size={18} className="spin" /> Loading face detection models...
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="login-username">Username</label>
          <input
            id="login-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Enter your username"
          />
        </div>

        <div className="form-group">
          <label>Facial Verification</label>
          <div className="webcam-wrapper">
            {!image ? (
              <>
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  width="100%"
                  videoConstraints={{ facingMode: 'user', width: 640, height: 480 }}
                />
                <div className="webcam-overlay"></div>
              </>
            ) : (
              <img src={image} alt="Verification snapshot" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            )}
          </div>

          {!image ? (
            <button type="button" onClick={capture} className="btn btn-secondary" disabled={!modelsReady}>
              <Camera size={18} /> Verify Identity
            </button>
          ) : (
            <button type="button" onClick={() => { setImage(null); setDescriptor(null); }} className="btn btn-secondary">
              Retake Snapshot
            </button>
          )}
        </div>

        <button type="submit" className="btn" disabled={loading || !modelsReady}>
          {loading ? <div className="loading-spinner"></div> : <><LogIn size={18} /> Login</>}
        </button>
      </form>
    </div>
  );
};

export default Login;
