// This is an auto-generated file, do not edit manually
export const definition = {"models":{"Event":{"interface":false,"implements":[],"id":"kjzl6hvfrbw6c60bb5siydwk3iyg6dav5gxee33ixwe2qt2ye5rgvvlos5js8gr","accountRelation":{"type":"list"}},"MVPProfile":{"interface":false,"implements":[],"id":"kjzl6hvfrbw6c66uig1mk220cq51ciqgxvcug0ydpoxthbh8qxmo6l47vvh35jm","accountRelation":{"type":"single"}},"Session":{"interface":false,"implements":[],"id":"kjzl6hvfrbw6c50y9ne6latftzcmzir5j76q4p8dcnzxkqonogebjieszljmggo","accountRelation":{"type":"list"}},"Space":{"interface":false,"implements":[],"id":"kjzl6hvfrbw6c96lu2u58syitpel0wrj25w9bq6pc6locv20i7rjyib1q088sen","accountRelation":{"type":"list"}}},"objects":{"Event":{"gated":{"type":"string","required":false,"immutable":false,"indexed":true},"title":{"type":"string","required":true,"immutable":false,"indexed":true},"admins":{"type":"list","required":false,"immutable":false,"item":{"type":"did","required":false,"immutable":false}},"status":{"type":"string","required":false,"immutable":false,"indexed":true},"tracks":{"type":"string","required":false,"immutable":false},"update":{"type":"list","required":false,"immutable":false,"item":{"type":"reference","refType":"object","refName":"EventOrganizerUpdate","required":false,"immutable":false}},"endTime":{"type":"datetime","required":true,"immutable":false,"indexed":true},"members":{"type":"list","required":false,"immutable":false,"item":{"type":"did","required":false,"immutable":false}},"spaceId":{"type":"streamid","required":true,"immutable":false},"tagline":{"type":"string","required":false,"immutable":false},"timezone":{"type":"string","required":false,"immutable":false},"contracts":{"type":"list","required":false,"immutable":false,"item":{"type":"reference","refType":"object","refName":"EventTicket","required":false,"immutable":false}},"createdAt":{"type":"datetime","required":true,"immutable":false,"indexed":true},"image_url":{"type":"string","required":false,"immutable":false},"profileId":{"type":"streamid","required":true,"immutable":false},"startTime":{"type":"datetime","required":true,"immutable":false,"indexed":true},"contractID":{"type":"integer","required":false,"immutable":false},"superAdmin":{"type":"list","required":true,"immutable":false,"item":{"type":"did","required":true,"immutable":false}},"zupassHash":{"type":"list","required":false,"immutable":false,"item":{"type":"reference","refType":"object","refName":"EventZupass","required":false,"immutable":false}},"customLinks":{"type":"list","required":false,"immutable":false,"item":{"type":"reference","refType":"object","refName":"EventLink","required":false,"immutable":false}},"description":{"type":"string","required":false,"immutable":false},"meeting_url":{"type":"string","required":false,"immutable":false},"external_url":{"type":"string","required":false,"immutable":false},"max_participant":{"type":"integer","required":false,"immutable":false},"min_participant":{"type":"integer","required":false,"immutable":false},"participant_count":{"type":"integer","required":false,"immutable":false},"space":{"type":"view","viewType":"relation","relation":{"source":"document","model":"kjzl6hvfrbw6c96lu2u58syitpel0wrj25w9bq6pc6locv20i7rjyib1q088sen","property":"spaceId"}},"author":{"type":"view","viewType":"documentAccount"},"profile":{"type":"view","viewType":"relation","relation":{"source":"document","model":"kjzl6hvfrbw6c66uig1mk220cq51ciqgxvcug0ydpoxthbh8qxmo6l47vvh35jm","property":"profileId"}},"sessions":{"type":"view","viewType":"relation","relation":{"source":"queryConnection","model":"kjzl6hvfrbw6c50y9ne6latftzcmzir5j76q4p8dcnzxkqonogebjieszljmggo","property":"eventId"}}},"EventLink":{"links":{"type":"string","required":true,"immutable":false},"title":{"type":"string","required":true,"immutable":false}},"EventOrganizerUpdate":{"title":{"type":"string","required":true,"immutable":false},"content":{"type":"string","required":false,"immutable":false},"createdAt":{"type":"datetime","required":true,"immutable":false},"organizer":{"type":"did","required":true,"immutable":false}},"EventTicket":{"type":{"type":"string","required":true,"immutable":false},"status":{"type":"string","required":true,"immutable":false},"image_url":{"type":"string","required":true,"immutable":false},"description":{"type":"string","required":true,"immutable":false},"contractAddress":{"type":"string","required":true,"immutable":false}},"EventZupass":{"hash":{"type":"string","required":true,"immutable":false}},"MVPProfile":{"avatar":{"type":"string","required":false,"immutable":false},"username":{"type":"string","required":true,"immutable":false,"indexed":true},"author":{"type":"view","viewType":"documentAccount"},"events":{"type":"view","viewType":"relation","relation":{"source":"queryConnection","model":"kjzl6hvfrbw6c60bb5siydwk3iyg6dav5gxee33ixwe2qt2ye5rgvvlos5js8gr","property":"profileId"}},"spaces":{"type":"view","viewType":"relation","relation":{"source":"queryConnection","model":"kjzl6hvfrbw6c96lu2u58syitpel0wrj25w9bq6pc6locv20i7rjyib1q088sen","property":"profileId"}}},"Session":{"tags":{"type":"string","required":true,"immutable":false,"indexed":true},"type":{"type":"string","required":false,"immutable":false},"gated":{"type":"string","required":true,"immutable":false,"indexed":true},"title":{"type":"string","required":true,"immutable":false,"indexed":true},"track":{"type":"string","required":true,"immutable":false,"indexed":true},"format":{"type":"string","required":true,"immutable":false,"indexed":true},"status":{"type":"string","required":true,"immutable":false,"indexed":true},"endTime":{"type":"datetime","required":true,"immutable":false,"indexed":true},"eventId":{"type":"streamid","required":true,"immutable":false},"speakers":{"type":"list","required":false,"immutable":false,"item":{"type":"did","required":false,"immutable":false}},"timezone":{"type":"string","required":false,"immutable":false},"createdAt":{"type":"datetime","required":true,"immutable":false,"indexed":true},"profileId":{"type":"streamid","required":true,"immutable":false},"startTime":{"type":"datetime","required":true,"immutable":false,"indexed":true},"video_url":{"type":"string","required":false,"immutable":false},"organizers":{"type":"list","required":false,"immutable":false,"item":{"type":"did","required":false,"immutable":false}},"description":{"type":"string","required":true,"immutable":false},"meeting_url":{"type":"string","required":false,"immutable":false},"experience_level":{"type":"string","required":false,"immutable":false},"event":{"type":"view","viewType":"relation","relation":{"source":"document","model":"kjzl6hvfrbw6c60bb5siydwk3iyg6dav5gxee33ixwe2qt2ye5rgvvlos5js8gr","property":"eventId"}},"author":{"type":"view","viewType":"documentAccount"},"profile":{"type":"view","viewType":"relation","relation":{"source":"document","model":"kjzl6hvfrbw6c66uig1mk220cq51ciqgxvcug0ydpoxthbh8qxmo6l47vvh35jm","property":"profileId"}}},"Space":{"ens":{"type":"string","required":false,"immutable":false},"lens":{"type":"string","required":false,"immutable":false},"name":{"type":"string","required":true,"immutable":false,"indexed":true},"gated":{"type":"string","required":false,"immutable":false,"indexed":true},"nostr":{"type":"string","required":false,"immutable":false},"admins":{"type":"list","required":false,"immutable":false,"item":{"type":"did","required":false,"immutable":false}},"avatar":{"type":"string","required":false,"immutable":false},"banner":{"type":"string","required":false,"immutable":false},"github":{"type":"string","required":false,"immutable":false},"discord":{"type":"string","required":false,"immutable":false},"members":{"type":"list","required":false,"immutable":false,"item":{"type":"did","required":false,"immutable":false}},"tagline":{"type":"string","required":false,"immutable":false,"indexed":true},"twitter":{"type":"string","required":false,"immutable":false},"website":{"type":"string","required":false,"immutable":false},"category":{"type":"string","required":false,"immutable":false,"indexed":true},"telegram":{"type":"string","required":false,"immutable":false},"profileId":{"type":"streamid","required":true,"immutable":false},"superAdmin":{"type":"list","required":true,"immutable":false,"item":{"type":"did","required":true,"immutable":false}},"customLinks":{"type":"list","required":false,"immutable":false,"item":{"type":"reference","refType":"object","refName":"SpaceLink","required":false,"immutable":false}},"description":{"type":"string","required":true,"immutable":false},"author":{"type":"view","viewType":"documentAccount"},"profile":{"type":"view","viewType":"relation","relation":{"source":"document","model":"kjzl6hvfrbw6c66uig1mk220cq51ciqgxvcug0ydpoxthbh8qxmo6l47vvh35jm","property":"profileId"}},"events":{"type":"view","viewType":"relation","relation":{"source":"queryConnection","model":"kjzl6hvfrbw6c60bb5siydwk3iyg6dav5gxee33ixwe2qt2ye5rgvvlos5js8gr","property":"spaceId"}}},"SpaceLink":{"links":{"type":"string","required":true,"immutable":false},"title":{"type":"string","required":true,"immutable":false}}},"enums":{},"accountData":{"eventList":{"type":"connection","name":"Event"},"mvpProfile":{"type":"node","name":"MVPProfile"},"sessionList":{"type":"connection","name":"Session"},"spaceList":{"type":"connection","name":"Space"}}}