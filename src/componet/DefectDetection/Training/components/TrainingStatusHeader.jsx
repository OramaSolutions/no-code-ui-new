function TrainingStatusHeader({statusText }) {
    return (
        <div className="rounded-xl border border-blue-300 bg-blue-50 p-6">
            {/* <h3 className="text-lg text-blue-600 font-bold">
                {inProgress ? 'Training in Progress' : 'Training Stopped'}
            </h3> */}
            <p className="text-sm text-gray-600 mt-1">{statusText}</p>
        </div>
    );
}
export default TrainingStatusHeader