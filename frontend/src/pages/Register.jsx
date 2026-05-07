import React, { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import api from '../api';
import { loadModels, getFaceDescriptor } from '../faceService';
import { Camera, UserPlus, ShieldCheck, AlertCircle, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [image, setImage] = useState(null);
  const [descriptor, setDescriptor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modelsReady, setModelsReady] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const webcamRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadModels()
      .then(() => setModelsReady(true))
      .catch(() => setError('Failed to load face detection models'));
  }, []);

  const capture = useCallback(async () => {
    if (!webcamRef.current) return;
    setError('');

    try {
      // Get face descriptor directly from the video element
      const video = webcamRef.current.video;
      const desc = await getFaceDescriptor(video);
      
      // Also take a screenshot for visual feedback
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
      setError('Please capture your face for biometric registration');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/register', {
        username,
        face_descriptor: descriptor,
      });
      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card animate-fade-in">
      <h2>Create Account</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Register with your username and face — no password needed.
      </p>

      {error && <div className="alert alert-error"><AlertCircle size={18} /> {error}</div>}
      {success && <div className="alert alert-success"><ShieldCheck size={18} /> {success}</div>}

      {!modelsReady && (
        <div className="alert" style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--primary)', border: '1px solid rgba(99,102,241,0.2)' }}>
          <Loader size={18} className="spin" /> Loading face detection models...
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="reg-username">Username</label>
          <input
            id="reg-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Choose a username"
          />
        </div>

        <div className="form-group">
          <label>Facial Biometric</label>
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
              <img src={image} alt="Captured face" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            )}
          </div>

          {!image ? (
            <button type="button" onClick={capture} className="btn btn-secondary" disabled={!modelsReady}>
              <Camera size={18} /> Capture Face
            </button>
          ) : (
            <button type="button" onClick={() => { setImage(null); setDescriptor(null); }} className="btn btn-secondary">
              Retake Photo
            </button>
          )}

          {descriptor && (
            <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={14} /> Face captured successfully
            </div>
          )}
        </div>

        <button type="submit" className="btn" disabled={loading || !modelsReady}>
          {loading ? <div className="loading-spinner"></div> : <><UserPlus size={18} /> Register</>}
        </button>
      </form>
    </div>
  );
};

export default Register;
