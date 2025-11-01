import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as api from "../api";
import { Select } from "../components/forms/Select";
import { Input } from "../components/forms/Input";
import { Textarea } from "../components/forms/Textarea";
import { FileUpload } from "../components/forms/FileUpload";

function SubmitQuestionPage() {
  const [formData, setFormData] = useState({
    university: "",
    college: "",
    course: "",
    semester: "",
    subject: "",
    examType: "Mid Sem",
    year: "",
    questionsText: "",
  });
  const [paperFile, setPaperFile] = useState(null);
  const [isUniversityLevel, setIsUniversityLevel] = useState(false);
  const [universities, setUniversities] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [loadingUniversities, setLoadingUniversities] = useState(true);
  const [loadingColleges, setLoadingColleges] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUniversities = async () => {
      try {
        const { data } = await api.fetchUniversities();
        setUniversities(data);
      } catch (error) {
        console.error("Failed to fetch universities", error);
      } finally {
        setLoadingUniversities(false);
      }
    };
    loadUniversities();
  }, []);

  // --- EVENT HANDLERS ---
  const handleUniversityChange = async (e) => {
    const universityId = e.target.value;
    setFormData({ ...formData, university: universityId, college: "" });
    setColleges([]);
    if (universityId) {
      setLoadingColleges(true);
      try {
        const { data } = await api.fetchCollegesByUniversity(universityId);
        setColleges(data);
      } catch (error) {
        console.error("Failed to fetch colleges", error);
      } finally {
        setLoadingColleges(false);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setPaperFile(e.target.files[0]);
  };

  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setIsUniversityLevel(isChecked);
    if (isChecked) {
      setFormData((prev) => ({ ...prev, college: "" }));
      setColleges([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!paperFile) {
      alert("Please upload a paper file.");
      return;
    }
    if (!isUniversityLevel && !formData.college) {
      alert("Please select a college or check the university-level exam box.");
      return;
    }

    setIsSubmitting(true);
    const submissionFormData = new FormData();
    if (!isUniversityLevel && formData.college) {
      submissionFormData.append("collegeId", formData.college);
    }
    submissionFormData.append("course", formData.course);
    submissionFormData.append("subject", formData.subject);
    submissionFormData.append("semester", formData.semester);
    submissionFormData.append("year", formData.year);
    submissionFormData.append("examType", formData.examType);
    submissionFormData.append("questionsText", formData.questionsText);
    submissionFormData.append("paperFile", paperFile);

    try {
      const { data } = await api.createQuestion(submissionFormData);
      navigate(`/questions/${data._id}`);
    } catch (error) {
      console.error("Submission error:", error);
      alert(error.response?.data?.message || "Failed to submit question.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="space-y-12">
          <div className="pb-8">
            <h2 className="text-2xl font-semibold leading-7 text-[#128c43]">
              Contribute a Paper
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-500">
              This information helps us categorize the paper correctly. All
              fields are required unless marked optional.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <Select
                  label="University"
                  name="university"
                  value={formData.university}
                  onChange={handleUniversityChange}
                  required
                >
                  <option value="" disabled>
                    {loadingUniversities ? "Loading..." : "-- Select --"}
                  </option>
                  {universities.map((uni) => (
                    <option key={uni._id} value={uni._id}>
                      {uni.name}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="sm:col-span-6">
                <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <input
                      id="universityLevelCheckbox"
                      name="isUniversityLevel"
                      type="checkbox"
                      checked={isUniversityLevel}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 rounded border-gray-400 text-[#16a34a] focus:ring-[#128c43]"
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label
                      htmlFor="universityLevelCheckbox"
                      className="font-medium text-gray-800"
                    >
                      University-Level Exam
                    </label>
                    <p className="text-gray-500">
                      Check this if the paper applies to the whole university,
                      not a specific college.
                    </p>
                  </div>
                </div>
              </div>

              {!isUniversityLevel && (
                <div className="sm:col-span-3">
                  <Select
                    label="College"
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    required={!isUniversityLevel}
                    disabled={!formData.university || loadingColleges}
                  >
                    <option value="" disabled>
                      {loadingColleges
                        ? "Loading..."
                        : colleges.length > 0
                        ? "-- Select --"
                        : "Select a university first"}
                    </option>
                    {colleges.map((col) => (
                      <option key={col._id} value={col._id}>
                        {col.name}
                      </option>
                    ))}
                  </Select>
                </div>
              )}

              <div className="sm:col-span-3">
                <Input
                  label="Course"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  placeholder="e.g., B.Tech CSE"
                  required
                />
              </div>
              <div className="sm:col-span-3">
                <Input
                  label="Subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g., Data Structures"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <Input
                  label="Year"
                  name="year"
                  type="number"
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="2024"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <Input
                  label="Semester"
                  name="semester"
                  type="number"
                  value={formData.semester}
                  onChange={handleChange}
                  placeholder="5"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <Select
                  label="Exam Type"
                  name="examType"
                  value={formData.examType}
                  onChange={handleChange}
                  required
                >
                  <option>Mid Sem</option>
                  <option>Final Sem</option>
                  <option>Quiz</option>
                  <option>Assignment</option>
                </Select>
              </div>

              <div className="col-span-full">
                <Textarea
                  label="Topics / Notes (Optional)"
                  name="questionsText"
                  value={formData.questionsText}
                  onChange={handleChange}
                  placeholder="e.g., Linked Lists, Stacks & Queues, Graph Traversal"
                />
                <p className="mt-3 text-sm leading-6 text-gray-500">
                  Add comma-separated topics to make this paper easier to find.
                </p>
              </div>

              <div className="col-span-full">
                <FileUpload
                  label="Question Paper File"
                  name="paperFile"
                  file={paperFile}
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-sm px-3 py-1.5 text-sm font-normal leading-6 text-[#16a34a] border border-[#16a34a] transition-colors duration-200 hover:bg-[#16a34a]/10"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-sm bg-[#16a34a] px-4 py-2 text-sm font-normal text-white shadow-sm hover:bg-[#128c43] focus-visible:outline-offset-2 focus-visible:outline-[#16a34a] disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit Paper"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SubmitQuestionPage;
