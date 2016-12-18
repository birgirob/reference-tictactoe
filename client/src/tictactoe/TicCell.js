import React from 'react';

export default function (injected) {
    const eventRouter = injected('eventRouter');
    const commandPort = injected('commandPort');
    const generateUUID = injected('generateUUID');

    class TicCell extends React.Component {
        constructor() {
            super();
            this.state = {
                side: 'X'
            }
        }
        componentWillMount(){
        }
        render() {
            return <div className="ticcell">
                {this.state.side}
            </div>
        }
    }
    return TicCell;
}
