/** @format */

export default function Stats() {
    return (
        <section className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-12">
            {[
                { value: "500K+", label: "Active Students" },
                { value: "98%", label: "Satisfaction Rate" },
                { value: "1k+", label: "Courses Available" },
                { value: "24/7", label: "Expert Support" },
            ].map((stat) => (
                <div
                    key={stat.label}
                    className="text-center"
                >
                    <div className="text-3xl font-bold text-primary">
                        {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                        {stat.label}
                    </div>
                </div>
            ))}
        </section>
    );
}
