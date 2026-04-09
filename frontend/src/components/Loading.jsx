// Loading component using custom bouncing dots loader

const Loading = ({ message = 'Loading...' }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-light-bg-secondary dark:bg-dark-bg">
            <div className="text-center">
                <span className="loader"></span>
            </div>
        </div>
    );
};

export default Loading;
