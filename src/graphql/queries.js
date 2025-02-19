/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      name
      email
      groups {
        nextToken
        __typename
      }
      progress {
        id
        userId
        currentSurah
        currentAyah
        currentJuz
        completedSurahs
        completedJuzs
        totalAyahsRead
        lastUpdated
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      userProgressId
      __typename
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        email
        createdAt
        updatedAt
        userProgressId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getReadingProgress = /* GraphQL */ `
  query GetReadingProgress($id: ID!) {
    getReadingProgress(id: $id) {
      id
      userId
      currentSurah
      currentAyah
      currentJuz
      completedSurahs
      completedJuzs
      totalAyahsRead
      lastUpdated
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listReadingProgresses = /* GraphQL */ `
  query ListReadingProgresses(
    $filter: ModelReadingProgressFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listReadingProgresses(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        currentSurah
        currentAyah
        currentJuz
        completedSurahs
        completedJuzs
        totalAyahsRead
        lastUpdated
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getGroup = /* GraphQL */ `
  query GetGroup($id: ID!) {
    getGroup(id: $id) {
      id
      name
      code
      members {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listGroups = /* GraphQL */ `
  query ListGroups(
    $filter: ModelGroupFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listGroups(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        code
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getProgressHistory = /* GraphQL */ `
  query GetProgressHistory($id: ID!) {
    getProgressHistory(id: $id) {
      id
      userId
      date
      surahsRead
      ayahsRead
      juzCompleted
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listProgressHistories = /* GraphQL */ `
  query ListProgressHistories(
    $filter: ModelProgressHistoryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProgressHistories(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        date
        surahsRead
        ayahsRead
        juzCompleted
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getGroupMembers = /* GraphQL */ `
  query GetGroupMembers($id: ID!) {
    getGroupMembers(id: $id) {
      id
      userId
      groupId
      user {
        id
        name
        email
        createdAt
        updatedAt
        userProgressId
        __typename
      }
      group {
        id
        name
        code
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listGroupMembers = /* GraphQL */ `
  query ListGroupMembers(
    $filter: ModelGroupMembersFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listGroupMembers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userId
        groupId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const groupMembersByUserId = /* GraphQL */ `
  query GroupMembersByUserId(
    $userId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelGroupMembersFilterInput
    $limit: Int
    $nextToken: String
  ) {
    groupMembersByUserId(
      userId: $userId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        groupId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const groupMembersByGroupId = /* GraphQL */ `
  query GroupMembersByGroupId(
    $groupId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelGroupMembersFilterInput
    $limit: Int
    $nextToken: String
  ) {
    groupMembersByGroupId(
      groupId: $groupId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        groupId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
