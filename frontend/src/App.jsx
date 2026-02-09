import { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { 
  GraduationCap, 
  Mail, 
  Phone, 
  User, 
  BookOpen,
  Code,
  LinkIcon,
  FileText,
  Send,
  CheckCircle,
  Loader2,
  Calendar,
  Award
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const domains = [
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Machine Learning',
  'DevOps',
  'Cloud Computing',
  'Cybersecurity',
  'UI/UX Design',
  'Other'
];

const popularSkills = [
  'JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js',
  'Angular', 'Vue.js', 'Django', 'Flask', 'SQL', 'MongoDB',
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'Git', 'TensorFlow',
  'PyTorch', 'Machine Learning', 'Data Analysis', 'Figma'
];

function App() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    university: '',
    degree: '',
    major: '',
    graduationYear: new Date().getFullYear() + 1,
    cgpa: '',
    preferredDomain: '',
    skills: [],
    resumeLink: '',
    githubProfile: '',
    linkedinProfile: '',
    coverLetter: ''
  });

  const [customSkill, setCustomSkill] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  console.log('🔵 App loaded. API URL:', API_URL);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const addCustomSkill = () => {
    if (customSkill.trim() && !formData.skills.includes(customSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, customSkill.trim()]
      }));
      setCustomSkill('');
    }
  };

  const removeSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🔵 Form submitted!');
    console.log('🔵 API URL:', API_URL);
    console.log('🔵 Form data:', formData);
    
    // Validation
    if (!formData.fullName || !formData.email || !formData.phone) {
      console.log('🔴 Validation failed: missing required fields');
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.skills.length === 0) {
      console.log('🔴 Validation failed: no skills selected');
      toast.error('Please select at least one skill');
      return;
    }

    setLoading(true);
    console.log('🔵 Sending request to:', `${API_URL}/applications`);

    try {
      const response = await axios.post(`${API_URL}/applications`, formData);
      
      console.log('🟢 Response received:', response.data);
      
      if (response.data.success) {
        toast.success('Application submitted successfully! 🎉');
        setSubmitted(true);
        
        // Reset form after 5 seconds
        setTimeout(() => {
          setFormData({
            fullName: '',
            email: '',
            phone: '',
            university: '',
            degree: '',
            major: '',
            graduationYear: new Date().getFullYear() + 1,
            cgpa: '',
            preferredDomain: '',
            skills: [],
            resumeLink: '',
            githubProfile: '',
            linkedinProfile: '',
            coverLetter: ''
          });
          setSubmitted(false);
        }, 5000);
      }
    } catch (error) {
      console.error('🔴 Submission error:', error);
      console.error('🔴 Error response:', error.response?.data);
      console.error('🔴 Status:', error.response?.status);
      
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach(err => {
          toast.error(err.msg);
        });
      } else {
        toast.error(error.response?.data?.message || 'Failed to submit application. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-purple-50 to-pink-50 p-4">
        <Toaster position="top-center" />
        <div className="card max-w-2xl w-full text-center animate-fade-in">
          <div className="mb-6">
            <CheckCircle className="w-24 h-24 text-green-500 mx-auto animate-bounce" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Application Submitted! 🎉
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Thank you for applying! We've sent a confirmation email to <strong>{formData.email}</strong>.
          </p>
          <div className="bg-primary-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-primary-800 mb-2">What happens next?</h3>
            <ul className="text-left text-gray-700 space-y-2">
              <li className="flex items-start">
                <Mail className="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Check your email (and spam folder) for confirmation</span>
              </li>
              <li className="flex items-start">
                <Calendar className="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>Our team will review your application within 5-7 business days</span>
              </li>
              <li className="flex items-start">
                <Phone className="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                <span>We'll contact you via email or phone for next steps</span>
              </li>
            </ul>
          </div>
          <p className="text-sm text-gray-500">
            Redirecting to form in a few seconds...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-purple-50 to-pink-50 py-12 px-4">
      <Toaster position="top-center" />
      
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <GraduationCap className="w-16 h-16 text-primary-600" />
        </div>
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Internship Application Portal
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Join our team of talented individuals! Fill out the form below to apply for our internship program.
        </p>
        <div className="mt-6 flex items-center justify-center gap-4 text-sm text-gray-500">
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
            <span>Free to apply</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
            <span>Instant confirmation</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
            <span>Reply within 5-7 days</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto card">
        
        {/* Personal Information */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <User className="w-6 h-6 mr-2 text-primary-600" />
            Personal Information
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="label">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="input-field"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="label">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="john@example.com"
                required
              />
            </div>

            <div>
              <label className="label">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input-field"
                placeholder="9876543210"
                pattern="[0-9]{10}"
                required
              />
            </div>
          </div>
        </div>

        {/* Educational Information */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <BookOpen className="w-6 h-6 mr-2 text-primary-600" />
            Educational Background
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="label">
                University/College <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="university"
                value={formData.university}
                onChange={handleChange}
                className="input-field"
                placeholder="Stanford University"
                required
              />
            </div>

            <div>
              <label className="label">
                Degree <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                className="input-field"
                placeholder="B.Tech, M.Tech, BCA, etc."
                required
              />
            </div>

            <div>
              <label className="label">
                Major/Specialization <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="major"
                value={formData.major}
                onChange={handleChange}
                className="input-field"
                placeholder="Computer Science"
                required
              />
            </div>

            <div>
              <label className="label">
                Expected Graduation Year <span className="text-red-500">*</span>
              </label>
              <select
                name="graduationYear"
                value={formData.graduationYear}
                onChange={handleChange}
                className="input-field"
                required
              >
                {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">
                CGPA/Percentage <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="cgpa"
                value={formData.cgpa}
                onChange={handleChange}
                className="input-field"
                placeholder="8.5"
                step="0.01"
                min="0"
                max="10"
                required
              />
            </div>
          </div>
        </div>

        {/* Internship Preferences */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Code className="w-6 h-6 mr-2 text-primary-600" />
            Internship Preferences
          </h2>
          
          <div className="mb-6">
            <label className="label">
              Preferred Domain <span className="text-red-500">*</span>
            </label>
            <select
              name="preferredDomain"
              value={formData.preferredDomain}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="">Select a domain</option>
              {domains.map(domain => (
                <option key={domain} value={domain}>{domain}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">
              Skills <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-gray-500 mb-3">Select all that apply or add your own</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {popularSkills.map(skill => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    formData.skills.includes(skill)
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSkill())}
                className="input-field"
                placeholder="Add custom skill..."
              />
              <button
                type="button"
                onClick={addCustomSkill}
                className="btn-secondary whitespace-nowrap"
              >
                Add Skill
              </button>
            </div>

            {formData.skills.length > 0 && (
              <div className="mt-4 p-4 bg-primary-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">Selected Skills:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map(skill => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-primary-600 text-white rounded-full text-sm"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="hover:bg-primary-700 rounded-full p-0.5"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Links */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <LinkIcon className="w-6 h-6 mr-2 text-primary-600" />
            Portfolio & Links (Optional)
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="label">Resume Link (Google Drive, Dropbox, etc.)</label>
              <input
                type="text"
                name="resumeLink"
                value={formData.resumeLink}
                onChange={handleChange}
                className="input-field"
                placeholder="https://drive.google.com/..."
              />
            </div>

            <div>
              <label className="label">GitHub Profile</label>
              <input
                type="text"
                name="githubProfile"
                value={formData.githubProfile}
                onChange={handleChange}
                className="input-field"
                placeholder="https://github.com/username"
              />
            </div>

            <div className="md:col-span-2">
              <label className="label">LinkedIn Profile</label>
              <input
                type="text"
                name="linkedinProfile"
                value={formData.linkedinProfile}
                onChange={handleChange}
                className="input-field"
                placeholder="https://linkedin.com/in/username"
              />
            </div>
          </div>
        </div>

        {/* Cover Letter */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FileText className="w-6 h-6 mr-2 text-primary-600" />
            Cover Letter (Optional)
          </h2>
          
          <div>
            <label className="label">
              Tell us why you'd be a great fit (max 1000 characters)
            </label>
            <textarea
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleChange}
              className="input-field min-h-[150px] resize-y"
              placeholder="Share your motivation, relevant experience, and what you hope to learn from this internship..."
              maxLength={1000}
            />
            <p className="text-sm text-gray-500 mt-2 text-right">
              {formData.coverLetter.length}/1000 characters
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="btn-secondary"
            disabled={loading}
          >
            Reset Form
          </button>
          <button
            type="submit"
            className="btn-primary flex items-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit Application
              </>
            )}
          </button>
        </div>
      </form>

      {/* Footer */}
      <div className="max-w-4xl mx-auto mt-8 text-center text-sm text-gray-500">
        <p>© 2024 Internship Portal. All applications are reviewed carefully.</p>
        <p className="mt-2">Questions? Email us at support@internship-portal.com</p>
      </div>
    </div>
  );
}

export default App;
