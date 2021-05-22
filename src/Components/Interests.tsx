import * as React from 'react';

interface InterestsProps { }

const Interests = (props: InterestsProps) => {
    return (
        <div>
            <p>
            <a data-bs-toggle="collapse" href="#collapseExample"  aria-expanded="false" aria-controls="collapseExample">
                 view interests
            </a>
            </p>
            <div className="collapse" id="collapseExample">
                <div className="card card-body">
                    Some placeholder content for the collapse component. This panel is hidden by default but revealed when the user activates the relevant trigger.
            </div>
            </div>
        </div>
    );
};

export default Interests;

