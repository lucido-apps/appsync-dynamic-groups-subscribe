import React, { useEffect, useState } from "react";
import Amplify, { API, graphqlOperation, Auth } from "aws-amplify";
import { Connect } from "aws-amplify-react";
import awsconfig from "./aws-exports";
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import * as mutations from "./graphql/mutations";
import * as queries from "./graphql/queries";
import * as subscriptions from "./graphql/subscriptions";

Amplify.configure(awsconfig);

const createPrivateTask = async () => {
  try {
    await API.graphql(
      graphqlOperation(mutations.createTask, {
        input: {
          title: `Private Task #${new Date().getTime()} - Only Accessible to owner`,
        },
      })
    );
  } catch (error) {
    console.log(error);
  }
};

const createSharedTask = async () => {
  try {
    await API.graphql(
      graphqlOperation(mutations.createTask, {
        input: {
          title: `Shared Task #${new Date().getTime()} - Accessible to Dynamic Groups`,
          myGroups: ["Collaborators"],
        },
      })
    );
  } catch (error) {
    console.log(error);
  }
};

const handleOnSubscription = (prevQuery, newData) => {
  const updatedQuery = Object.assign({}, prevQuery);
  updatedQuery.listTasks.items = prevQuery.listTasks.items.concat([
    newData.onCreateTask,
  ]);
  return updatedQuery;
};

function App() {
  const [owner, setOwner] = useState();

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(({ username }) => setOwner(username))
      .catch((err) => console.log(err));
  }, []);

  if (owner) {
    return (
      <div>
        <h3>{`logged in as (owner): ${owner}`}</h3>
        <button onClick={createPrivateTask}>Create Private Task</button>
        <button onClick={createSharedTask}>Create Shared Task</button>
        <Connect
          query={graphqlOperation(queries.listTasks)}
          subscription={graphqlOperation(subscriptions.onCreateTask, { owner })}
          onSubscriptionMsg={handleOnSubscription}
        >
          {({ data, loading, errors }) => {
            if (loading) {
              return <div>Loading...</div>;
            }
            if (errors.length > 0) {
              return <pre>{JSON.stringify(errors)}</pre>;
            }
            if (!data || !data.listTasks || !data.listTasks.items) return;

            return (
              <pre>
                {data.listTasks.items.map(
                  (item) =>
                    `- title:    ${item.title}\n  owner:    ${item.owner}\n  myGroups: ${item.myGroups}\n\n`
                )}
              </pre>
            );
          }}
        </Connect>
        <AmplifySignOut />
      </div>
    );
  }

  return <div>Loading...</div>;
}

export default withAuthenticator(App);
