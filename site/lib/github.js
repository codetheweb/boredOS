const Octokit = require('@octokit/rest');

const octokit = new Octokit();
const $ = require('jquery');

async function getUserActivity(username, limit) {
  const {data} = await octokit.activity.listEventsForUser({username, per_page: limit * 10});

  const result = {
    user: {
      username,
      avatar: data[0].actor.avatar_url
    },
    events: []};

  let totalEvents = 0;

  data.forEach(event => {
    const thisEvent = {};

    // Add time
    thisEvent.time = new Date(event.created_at);

    // Add message
    thisEvent.message = '';

    switch (event.type) {
      case 'PushEvent':
        thisEvent.message += event.payload.commits[0].message;
        break;
      case 'IssueCommentEvent':
        thisEvent.message += event.payload.comment.body;
        break;
      default:
        break;
    }

    if (thisEvent.message !== '' && totalEvents < limit) {
      thisEvent.message = thisEvent.message.replace(/\n/g, '');

      // Strip out HTML tags
      thisEvent.message = $(`<p>${thisEvent.message}</p>`).text();

      result.events.push(thisEvent);

      totalEvents++;
    }
  });

  return result;
}

module.exports = {getUserActivity};
