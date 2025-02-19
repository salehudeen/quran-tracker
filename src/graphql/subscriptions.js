/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($filter: ModelSubscriptionUserFilterInput) {
    onCreateUser(filter: $filter) {
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
    onUpdateUser(filter: $filter) {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($filter: ModelSubscriptionUserFilterInput) {
    onDeleteUser(filter: $filter) {
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
export const onCreateReadingProgress = /* GraphQL */ `
  subscription OnCreateReadingProgress(
    $filter: ModelSubscriptionReadingProgressFilterInput
  ) {
    onCreateReadingProgress(filter: $filter) {
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
export const onUpdateReadingProgress = /* GraphQL */ `
  subscription OnUpdateReadingProgress(
    $filter: ModelSubscriptionReadingProgressFilterInput
  ) {
    onUpdateReadingProgress(filter: $filter) {
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
export const onDeleteReadingProgress = /* GraphQL */ `
  subscription OnDeleteReadingProgress(
    $filter: ModelSubscriptionReadingProgressFilterInput
  ) {
    onDeleteReadingProgress(filter: $filter) {
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
export const onCreateGroup = /* GraphQL */ `
  subscription OnCreateGroup($filter: ModelSubscriptionGroupFilterInput) {
    onCreateGroup(filter: $filter) {
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
export const onUpdateGroup = /* GraphQL */ `
  subscription OnUpdateGroup($filter: ModelSubscriptionGroupFilterInput) {
    onUpdateGroup(filter: $filter) {
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
export const onDeleteGroup = /* GraphQL */ `
  subscription OnDeleteGroup($filter: ModelSubscriptionGroupFilterInput) {
    onDeleteGroup(filter: $filter) {
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
export const onCreateProgressHistory = /* GraphQL */ `
  subscription OnCreateProgressHistory(
    $filter: ModelSubscriptionProgressHistoryFilterInput
  ) {
    onCreateProgressHistory(filter: $filter) {
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
export const onUpdateProgressHistory = /* GraphQL */ `
  subscription OnUpdateProgressHistory(
    $filter: ModelSubscriptionProgressHistoryFilterInput
  ) {
    onUpdateProgressHistory(filter: $filter) {
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
export const onDeleteProgressHistory = /* GraphQL */ `
  subscription OnDeleteProgressHistory(
    $filter: ModelSubscriptionProgressHistoryFilterInput
  ) {
    onDeleteProgressHistory(filter: $filter) {
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
export const onCreateGroupMembers = /* GraphQL */ `
  subscription OnCreateGroupMembers(
    $filter: ModelSubscriptionGroupMembersFilterInput
  ) {
    onCreateGroupMembers(filter: $filter) {
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
export const onUpdateGroupMembers = /* GraphQL */ `
  subscription OnUpdateGroupMembers(
    $filter: ModelSubscriptionGroupMembersFilterInput
  ) {
    onUpdateGroupMembers(filter: $filter) {
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
export const onDeleteGroupMembers = /* GraphQL */ `
  subscription OnDeleteGroupMembers(
    $filter: ModelSubscriptionGroupMembersFilterInput
  ) {
    onDeleteGroupMembers(filter: $filter) {
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
