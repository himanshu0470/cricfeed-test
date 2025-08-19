// components/Partnership/Skeleton/PartnershipDetailsSkeleton.tsx

export default function PartnershipTabSkeleton() {
    return (
        <div className="bg-white rounded-lg accordion row" id="accordion">
            {[1, 2].map((teamNum) => (
                <div key={teamNum} className="accordion-item col-12 col-md-12 col-lg-6">
                    <div className="p-3">
                        <div className="flex items-center space-x-3">
                            <div className="skeleton-loader w-10 h-10 rounded-full" />
                            <div className="skeleton-loader h-6 w-32" />
                        </div>
                    </div>

                    <div className="p-4">
                        {[1, 2, 3].map((partnershipNum) => (
                            <div
                                key={partnershipNum}
                                className="score-card score-card-lg d-md-flex p-3 mb-3"
                            >
                                <div className="score-card-inner w-full">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center space-x-3">
                                            <div className="skeleton-loader w-10 h-10 rounded-full" />
                                            <div className="skeleton-loader h-4 w-24" />
                                        </div>
                                        <div className="skeleton-loader h-8 w-16" />
                                        <div className="flex items-center space-x-3">
                                            <div className="skeleton-loader h-4 w-24" />
                                            <div className="skeleton-loader w-10 h-10 rounded-full" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}