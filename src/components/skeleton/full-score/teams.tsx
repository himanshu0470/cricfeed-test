// components/Skeleton/LiveTeamSkeleton.tsx
export default function TeamSkeleton() {
    return (
        <div className="animate-pulse bg-white rounded-lg">
            <div className="grid grid-cols-1 gap-4">
                {[1, 2].map((teamNum) => (
                    <div key={`team-${teamNum}`} className="bg-white rounded-lg shadow-sm p-4">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                            <div className="h-6 w-32 bg-gray-200 rounded"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[...Array(11)].map((_, idx) => (
                                <div key={idx} className="flex items-center space-x-3 p-3 border rounded-lg">
                                    <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                                    <div className="space-y-2">
                                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                                        <div className="h-3 w-16 bg-gray-200 rounded"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}