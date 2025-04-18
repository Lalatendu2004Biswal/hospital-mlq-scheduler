from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Helper function for First Come First Serve (FCFS) scheduling
def fcfs_schedule(patients):
    patients = sorted(patients, key=lambda x: x['arrival_time'])
    start_time = 0
    results = []
    
    for patient in patients:
        wait_time = start_time - patient['arrival_time']
        turn_around_time = wait_time + patient['burst_time']
        completion_time = start_time + patient['burst_time']
        results.append({
            'PID': patient['pid'],
            'Queue': 'Critical (FCFS)',
            'Start': start_time,
            'Complete': completion_time,
            'Waiting Time': wait_time,
            'Turnaround Time': turn_around_time
        })
        start_time = completion_time

    return results

# Helper function for Priority Scheduling
def priority_schedule(patients):
    patients = sorted(patients, key=lambda x: (-x['priority'], x['arrival_time']))
    start_time = 0
    results = []
    
    for patient in patients:
        wait_time = start_time - patient['arrival_time']
        turn_around_time = wait_time + patient['burst_time']
        completion_time = start_time + patient['burst_time']
        results.append({
            'PID': patient['pid'],
            'Queue': 'Serious (Priority)',
            'Start': start_time,
            'Complete': completion_time,
            'Waiting Time': wait_time,
            'Turnaround Time': turn_around_time
        })
        start_time = completion_time

    return results

# Helper function for Round Robin Scheduling
def round_robin_schedule(patients, time_slice=4):
    patients = sorted(patients, key=lambda x: x['arrival_time'])
    ready_queue = patients[:]
    start_time = 0
    results = []
    
    while ready_queue:
        current_patient = ready_queue.pop(0)
        if current_patient['burst_time'] > time_slice:
            ready_queue.append({
                'pid': current_patient['pid'],
                'arrival_time': start_time + time_slice,
                'burst_time': current_patient['burst_time'] - time_slice,
                'priority': current_patient['priority'],
                'queue_level': current_patient['queue_level']
            })
            current_patient['burst_time'] = time_slice
        wait_time = start_time - current_patient['arrival_time']
        turn_around_time = wait_time + current_patient['burst_time']
        completion_time = start_time + current_patient['burst_time']
        results.append({
            'PID': current_patient['pid'],
            'Queue': 'Normal (Round Robin)',
            'Start': start_time,
            'Complete': completion_time,
            'Waiting Time': wait_time,
            'Turnaround Time': turn_around_time
        })
        start_time = completion_time

    return results

@app.route('/simulate', methods=['POST'])
def simulate():
    data = request.get_json()
    patients = data['patients']

    # Separate patients by their queue level (coma, icu, accident, normal injury)
    critical_patients = [p for p in patients if p['queue_level'] == 1]
    serious_patients = [p for p in patients if p['queue_level'] == 2]
    normal_patients = [p for p in patients if p['queue_level'] == 3]

    # Apply FCFS to Critical (coma, ICU)
    critical_result = fcfs_schedule(critical_patients)
    # Apply Priority Scheduling to Serious (accident)
    serious_result = priority_schedule(serious_patients)
    # Apply Round Robin to Normal (normal injury)
    normal_result = round_robin_schedule(normal_patients)

    # Combine all the results
    all_results = critical_result + serious_result + normal_result
    return jsonify(all_results)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
