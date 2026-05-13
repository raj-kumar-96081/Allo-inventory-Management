'use client';

export default function ErrorPage({
    error,
    reset,
}: {
    error: Error;

    reset: () => void;
}) {

    return (
        <div className="container py-5">

            <div
                className="
          alert
          alert-danger
        "
            >

                <h2>
                    Something went wrong
                </h2>

                <p>
                    {error.message}
                </p>

                <button
                    className="
            btn
            btn-dark
          "

                    onClick={reset}
                >
                    Try Again
                </button>

            </div>

        </div>
    );
}