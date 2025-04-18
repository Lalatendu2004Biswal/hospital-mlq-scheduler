import React, { useState } from "react";
import axios from "axios";

export default function App() {
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
    pid: "",
    arrival_time: 0,
    burst_time: 0,
    priority: 0,
    condition: "normal injury",
  });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getQueueLevel = (condition) => {
    switch (condition) {
      case "coma":
      case "icu":
        return 1;
      case "accident":
        return 2;
      default:
        return 3;
    }
  };

  const addPatient = () => {
    const queue_level = getQueueLevel(formData.condition);
    setPatients([
      ...patients,
      {
        ...formData,
        arrival_time: Number(formData.arrival_time),
        burst_time: Number(formData.burst_time),
        priority: Number(formData.priority),
        queue_level,
      },
    ]);
    setFormData({
      pid: "",
      arrival_time: 0,
      burst_time: 0,
      priority: 0,
      condition: "normal injury",
    });
  };

  const simulate = async () => {
    const res = await axios.post("http://localhost:5000/simulate", { patients });
    setResult(res.data);
  };

  const queueLabel = (level) => {
    switch (level) {
      case 1: return "Critical (FCFS)";
      case 2: return "Serious (Priority)";
      case 3: return "Normal (Round Robin)";
      default: return "Unknown";
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🏥 Hospital MLQ Scheduler</h1>

      <div className="mb-4 grid grid-cols-2 gap-2">
        <input className="p-2 border" placeholder="PID" name="pid" value={formData.pid} onChange={handleChange} />
        <input className="p-2 border" placeholder="Arrival Time" name="arrival_time" value={formData.arrival_time} onChange={handleChange} />
        <input className="p-2 border" placeholder="Burst Time" name="burst_time" value={formData.burst_time} onChange={handleChange} />
        <input className="p-2 border" placeholder="Priority" name="priority" value={formData.priority} onChange={handleChange} />
        <select className="p-2 border col-span-2" name="condition" value={formData.condition} onChange={handleChange}>
          <option value="coma">Coma</option>
          <option value="icu">ICU</option>
          <option value="accident">Accident</option>
          <option value="normal injury">Normal Injury</option>
        </select>
        <button onClick={addPatient} className="bg-blue-500 text-white p-2 col-span-2">Add Patient</button>
      </div>

      <button onClick={simulate} className="bg-green-600 text-white p-2 mb-4 w-full">Simulate</button>

      {result && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Simulation Output</h2>
          <table className="w-full table-auto border text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-2">PID</th>
                <th className="border px-2">Queue</th>
                <th className="border px-2">Start Time</th>
                <th className="border px-2">Completion Time</th>
                <th className="border px-2">Waiting Time</th>
                <th className="border px-2">Turnaround Time</th>
              </tr>
            </thead>
            <tbody>
              {result.map((p, idx) => (
                <tr key={idx} className="text-center">
                  <td className="border px-2">{p.PID}</td>
                  <td className="border px-2">{queueLabel(p.Queue)}</td>
                  <td className="border px-2">{p.Start}</td>
                  <td className="border px-2">{p.Complete}</td>
                  <td className="border px-2">{p["Waiting Time"]}</td>
                  <td className="border px-2">{p["Turnaround Time"]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
